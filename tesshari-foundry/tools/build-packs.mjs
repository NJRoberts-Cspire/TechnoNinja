/**
 * tesshari-foundry — compendium pack builder.
 *
 * Reads tesshari-app/src/data/generated.ts, maps Tesshari entities onto
 * Foundry Item shapes, and writes one JSON file per document into
 * packs-src/<pack-name>/. Run `fvtt package pack <pack-name>` afterwards to
 * compile each directory into a LevelDB pack under packs/.
 *
 * Current packs:
 *   cards  — every action where isCard === true
 *   items  — every Tesshari item entry, routed to cybernetic | consumable
 *            (others skipped for now)
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { loadGenerated } from "./load-generated.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TS_FILE = path.resolve(ROOT, "../tesshari-app/src/data/generated.ts");
const PACKS_SRC = path.resolve(ROOT, "packs-src");

/** Foundry document IDs are 16 alphanumeric chars; sha1-truncate for determinism. */
function deterministicId(seed) {
  const hash = crypto.createHash("sha1").update(String(seed)).digest("hex");
  return hash.slice(0, 16);
}

function ensureCleanDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function writeDoc(dir, slug, doc) {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "_");
  fs.writeFileSync(path.join(dir, `${safe}.json`), JSON.stringify(doc, null, 2));
}

/* ────────────────────────────────────────────────────────────────────────
 * Shared maps
 * ──────────────────────────────────────────────────────────────────────── */

const RACE_SLUGS = new Set([
  "forged", "tethered", "echoed", "wireborn",
  "stitched", "shellbroken", "iron_blessed", "diminished",
]);

const RACE_DISPLAY = {
  forged: "Forged", tethered: "Tethered", echoed: "Echoed", wireborn: "Wireborn",
  stitched: "Stitched", shellbroken: "Shellbroken", iron_blessed: "Iron Blessed", diminished: "Diminished",
};

const CATEGORY_MAP = {
  combat_card:    "attack",
  attack_card:    "attack",
  defense_card:   "defense",
  control_card:   "control",
  reaction_card:  "reaction",
  passive_card:   "passive",
  mobility_card:  "mobility",
  utility_card:   "utility",
  signature_card: "signature",
  power_card:     "power",
};

const CARD_CATEGORIES = new Set([
  "attack", "defense", "control", "power", "reaction",
  "passive", "mobility", "utility", "signature", "boss",
]);

/** Map an action's cardType + category + baseDamage into our card category enum. */
function resolveCategory(action) {
  const rawCT = (action.cardType ?? "").toLowerCase();
  if (CARD_CATEGORIES.has(rawCT)) return rawCT;
  const mapped = CATEGORY_MAP[(action.category ?? "").toLowerCase()];
  if (mapped) return mapped;
  if ((action.baseDamage ?? 0) > 0 || action.damageStat) return "attack";
  return "utility";
}

/** Tier defaults — use action.tier if set, else derive from AP cost. */
function resolveTier(action) {
  if (Number.isInteger(action.tier)) return action.tier;
  const ap = action.apCost ?? 0;
  return Math.max(0, Math.min(ap, 3));
}

/** Parse Pierce keyword out of action.keywords[] if present. */
function extractPierce(keywords) {
  const hit = (keywords ?? []).find(k => (k.name ?? "").toLowerCase() === "pierce");
  return hit?.value ?? 0;
}

/** Convert keywords [{name,value}] → string array, dropping Pierce (stored as its own field). */
function formatKeywords(keywords) {
  return (keywords ?? [])
    .filter(k => (k.name ?? "").toLowerCase() !== "pierce")
    .map(k => k.value != null ? `${k.name} ${k.value}` : k.name);
}

/** If id starts with card_<race>_ we treat as a race card. */
function detectRace(id) {
  const m = String(id ?? "").match(/^card_([a-z_]+?)_/);
  if (!m) return null;
  // Peel one or two tokens; Iron Blessed is a two-token slug
  const twoTokens = m[1].split("_").slice(0, 2).join("_");
  if (RACE_SLUGS.has(m[1])) return m[1];
  if (RACE_SLUGS.has(twoTokens)) return twoTokens;
  return null;
}

/* ────────────────────────────────────────────────────────────────────────
 * Builders
 * ──────────────────────────────────────────────────────────────────────── */

function buildCardsPack(data, outDir) {
  const { ACTIONS, ACTIONS_BY_CLASS, ACTIONS_BY_SUBCLASS } = data;

  // Reverse maps: action id → class / subclass
  const classByAction = {};
  for (const [className, ids] of Object.entries(ACTIONS_BY_CLASS ?? {})) {
    for (const id of ids) classByAction[id] = className;
  }
  const subclassByAction = {};
  for (const [subKey, ids] of Object.entries(ACTIONS_BY_SUBCLASS ?? {})) {
    for (const id of ids) subclassByAction[id] = subKey;
  }

  ensureCleanDir(outDir);
  let count = 0;

  for (const action of ACTIONS ?? []) {
    if (!action.isCard) continue;

    const raceSlug = detectRace(action.id);
    const isRaceCard = !!raceSlug;
    const className = isRaceCard ? "" : (classByAction[action.id] ?? "");
    const subclass  = subclassByAction[action.id] ?? "";

    const tier = resolveTier(action);
    const apCost = action.apCost ?? tier ?? 0;
    const category = resolveCategory(action);
    const primaryStat = (action.damageStat ?? "").toLowerCase();
    const pierce = extractPierce(action.keywords);
    const keywords = formatKeywords(action.keywords);

    const doc = {
      _id: deterministicId(action.id),
      name: action.title || action.id,
      type: "card",
      img: "icons/svg/combat.svg",
      system: {
        tier,
        apCost,
        baseDamage: action.baseDamage ?? 0,
        pierce,
        category,
        primaryStat,
        keywords,
        unlockLevel: action.unlockLevel ?? 1,
        className,
        subclass,
        isRaceCard,
        race: isRaceCard ? (RACE_DISPLAY[raceSlug] ?? "") : "",
        isStartingHand: !!action.startingHand,
        isReaction: category === "reaction",
        usesPerCombat: null,
        description: `<p>${escapeHtml(action.description ?? "")}</p>`,
      },
      effects: [],
      flags: { tesshari: { sourceId: action.id } },
      folder: null,
      sort: (tier * 1000) + (action.unlockLevel ?? 0),
      ownership: { default: 0 },
    };

    writeDoc(outDir, action.id, doc);
    count++;
  }

  return count;
}

function buildItemsPack(data, outDir) {
  const { ITEMS } = data;
  ensureCleanDir(outDir);
  let count = 0;

  for (const item of ITEMS ?? []) {
    const category = (item.category ?? "").toLowerCase();

    // Route to a Foundry item type
    let type = null;
    if (category === "augmentation") type = "cybernetic";
    else if (item.isConsumable) type = "consumable";
    else if (item.isEquippable && category.includes("weapon")) type = "weapon";
    else if (item.isEquippable && category.includes("armor")) type = "armor";
    else if (item.isEquippable) type = "cybernetic";
    else type = "consumable"; // fallback for gear

    const systemPayload = {
      description: `<p>${escapeHtml(item.description ?? "")}</p>`,
    };

    if (type === "cybernetic") {
      systemPayload.slot = category;
      systemPayload.statMods = {};
      systemPayload.handMod = 0;
      systemPayload.cardUnlockSlug = "";
      systemPayload.equipped = false;
    } else if (type === "weapon") {
      systemPayload.weaponType = "";
      systemPayload.equipped = false;
      systemPayload.cardMods = [];
    } else if (type === "armor") {
      systemPayload.armorType = "";
      systemPayload.equipped = false;
      systemPayload.cardMods = [];
    } else if (type === "consumable") {
      systemPayload.charges = 1;
      systemPayload.maxCharges = 1;
      systemPayload.cardMods = [];
    }

    const doc = {
      _id: deterministicId(item.id),
      name: item.title || item.id,
      type,
      img: "icons/svg/item-bag.svg",
      system: systemPayload,
      effects: [],
      flags: { tesshari: { sourceId: item.id, originalCategory: item.category } },
      folder: null,
      sort: 0,
      ownership: { default: 0 },
    };

    writeDoc(outDir, item.id, doc);
    count++;
  }

  return count;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
}

/* ────────────────────────────────────────────────────────────────────────
 * Main
 * ──────────────────────────────────────────────────────────────────────── */

function main() {
  console.log(`Loading ${path.relative(ROOT, TS_FILE)} ...`);
  const data = loadGenerated(TS_FILE);
  console.log(`  ACTIONS: ${data.ACTIONS?.length ?? 0}`);
  console.log(`  ITEMS:   ${data.ITEMS?.length ?? 0}`);
  console.log(`  CLASSES: ${data.CLASSES?.length ?? 0}`);

  const cardsDir = path.join(PACKS_SRC, "cards");
  const itemsDir = path.join(PACKS_SRC, "items");

  const cardsCount = buildCardsPack(data, cardsDir);
  console.log(`Wrote ${cardsCount} card documents to ${path.relative(ROOT, cardsDir)}`);

  const itemsCount = buildItemsPack(data, itemsDir);
  console.log(`Wrote ${itemsCount} item documents to ${path.relative(ROOT, itemsDir)}`);

  console.log("\nNext: run `fvtt package pack cards` and `fvtt package pack items` to compile to LevelDB.");
}

main();
