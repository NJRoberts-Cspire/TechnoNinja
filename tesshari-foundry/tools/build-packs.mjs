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
import {
  loadAllMarkdownCards, normalizeName,
  loadRaceSections, loadClassSections,
} from "./parse-markdown-cards.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const TS_FILE = path.resolve(REPO_ROOT, "tesshari-app/src/data/generated.ts");
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

function buildCardsPack(data, mdCards, outDir) {
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
  let enriched = 0;

  for (const action of ACTIONS ?? []) {
    if (!action.isCard) continue;

    const raceSlug = detectRace(action.id);
    const isRaceCard = !!raceSlug;
    const className = isRaceCard ? "" : (classByAction[action.id] ?? "");
    const subclass  = subclassByAction[action.id] ?? "";

    // Lookup richer card data from the class/race markdown
    const md = mdCards[normalizeName(action.title)] ?? null;
    if (md) enriched++;

    const tier        = md?.tier        ?? resolveTier(action);
    const apCost      = md?.apCost      ?? action.apCost ?? tier ?? 0;
    const category    = md?.category    ?? resolveCategory(action);
    const baseDamage  = md?.baseDamage  ?? action.baseDamage ?? 0;
    const primaryStat = md?.primaryStat ?? (action.damageStat ?? "").toLowerCase();
    const pierceFromMd = (md?.keywords ?? []).find(k => /^pierce\s/i.test(k));
    const pierce = pierceFromMd
      ? parseInt(pierceFromMd.match(/\d+/)?.[0] ?? "0", 10)
      : extractPierce(action.keywords);
    const keywords = md?.keywords
      ? md.keywords.filter(k => !/^pierce\s/i.test(k))
      : formatKeywords(action.keywords);
    const unlockLevel = md?.unlockLevel ?? action.unlockLevel ?? 1;
    const startingHand = md?.startingHand ?? !!action.startingHand;
    const description = md?.effect
      ? `<p>${escapeHtml(md.effect)}</p>`
      : `<p>${escapeHtml(action.description ?? "")}</p>`;

    const doc = {
      _id: deterministicId(action.id),
      _key: `!items!${deterministicId(action.id)}`,
      name: action.title || action.id,
      type: "card",
      img: "icons/svg/combat.svg",
      system: {
        tier,
        apCost,
        baseDamage,
        pierce,
        category,
        primaryStat,
        keywords,
        unlockLevel,
        className,
        subclass,
        isRaceCard,
        race: isRaceCard ? (RACE_DISPLAY[raceSlug] ?? "") : "",
        isStartingHand: startingHand,
        isReaction: category === "reaction",
        usesPerCombat: null,
        description,
      },
      effects: [],
      flags: { tesshari: { sourceId: action.id, enrichedFromMarkdown: !!md } },
      folder: null,
      sort: (tier * 1000) + (unlockLevel ?? 0),
      ownership: { default: 0 },
    };

    writeDoc(outDir, action.id, doc);
    count++;
  }

  return { count, enriched };
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

    const itemDocId = deterministicId(item.id);
    const doc = {
      _id: itemDocId,
      _key: `!items!${itemDocId}`,
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
 * Race / class / subclass item builders
 * ──────────────────────────────────────────────────────────────────────── */

function buildRacePack(data, repoRoot, outDir) {
  const { SPECIES, RACE_STAT_BONUSES, RACE_HAND_MOD, SPECIES_FLAVOR } = data;
  const mdSections = loadRaceSections(repoRoot);

  ensureCleanDir(outDir);
  let count = 0;

  for (const raceName of SPECIES ?? []) {
    const bonuses = RACE_STAT_BONUSES[raceName] ?? [];
    // Convert [{stat:"IRON", value:1}, {stat:"any", value:1}] → {iron:1, any:1}
    const statBonuses = {};
    for (const b of bonuses) statBonuses[String(b.stat).toLowerCase()] = b.value;

    const sectionKey = raceName;  // "Forged" etc.
    const sec = mdSections[sectionKey];

    const raceDocId = deterministicId(`race_${raceName}`);
    const doc = {
      _id: raceDocId,
      _key: `!items!${raceDocId}`,
      name: raceName,
      type: "race",
      img: "icons/svg/mystery-man.svg",
      system: {
        statBonuses,
        handMod: RACE_HAND_MOD[raceName] ?? 0,
        heritageBranches: sec?.heritageBranches ?? [],
        raceCardSlugs: [],
        passives: sec?.passivesHtml ?? "",
        description: sec?.descriptionHtml ?? `<p>${escapeHtml(SPECIES_FLAVOR?.[raceName] ?? "")}</p>`,
      },
      effects: [],
      flags: { tesshari: { sourceKey: raceName } },
      folder: null,
      sort: 0,
      ownership: { default: 0 },
    };

    writeDoc(outDir, `race_${raceName}`.toLowerCase().replace(/\s+/g, "_"), doc);
    count++;
  }

  return count;
}

/**
 * Load per-class resource definitions from tools/class-resources-overlay.json.
 * Keys are display class names; values are arrays matching
 * ClassDataModel.classResources[]. Missing → empty object.
 */
function loadClassResourcesOverlay() {
  const file = path.resolve(__dirname, "class-resources-overlay.json");
  if (!fs.existsSync(file)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    // Strip the leading "_comment" field so it never lands in a class doc.
    const { _comment, ...rest } = raw;
    return rest;
  } catch (err) {
    console.warn(`build-packs | failed to parse class-resources overlay: ${err.message}`);
    return {};
  }
}

function buildClassPack(data, repoRoot, outDir) {
  const {
    CLASSES, CLASS_HP_TIER, CLASS_HAND_BASE, CLASS_PRIMARY_STATS,
    SUBCLASS_BY_CLASS, CLASS_FLAVOR,
  } = data;
  const { classes: mdClasses } = loadClassSections(repoRoot);
  const resourceOverlay = loadClassResourcesOverlay();

  ensureCleanDir(outDir);
  let count = 0;

  for (const className of CLASSES ?? []) {
    const sec = mdClasses[className];
    const hpTier = String(CLASS_HP_TIER?.[className] ?? "Balanced").toLowerCase();

    const classDocId = deterministicId(`class_${className}`);
    const doc = {
      _id: classDocId,
      _key: `!items!${classDocId}`,
      name: className,
      type: "class",
      img: "icons/svg/mystery-man.svg",
      system: {
        hpTier,
        handBase: CLASS_HAND_BASE?.[className] ?? 6,
        primaryStats: (CLASS_PRIMARY_STATS?.[className] ?? []).map(s => String(s).toLowerCase()),
        startingHandSlugs: sec?.startingHand ?? [],
        unlockList: {},
        subclassSlugs: SUBCLASS_BY_CLASS?.[className] ?? [],
        classResources: resourceOverlay[className] ?? [],
        description: sec?.descriptionHtml ?? `<p>${escapeHtml(CLASS_FLAVOR?.[className] ?? "")}</p>`,
      },
      effects: [],
      flags: { tesshari: { sourceKey: className } },
      folder: null,
      sort: 0,
      ownership: { default: 0 },
    };

    writeDoc(outDir, `class_${className}`.toLowerCase().replace(/\s+/g, "_"), doc);
    count++;
  }

  return count;
}

function buildSubclassPack(data, repoRoot, outDir) {
  const { SUBCLASS_FLAVOR } = data;
  const { subclasses: mdSubs } = loadClassSections(repoRoot);

  ensureCleanDir(outDir);
  let count = 0;

  for (const entry of Object.values(mdSubs)) {
    const subclassDocId = deterministicId(`subclass_${entry.className}_${entry.pathKey}`);
    const doc = {
      _id: subclassDocId,
      _key: `!items!${subclassDocId}`,
      name: entry.displayName,
      type: "subclass",
      img: "icons/svg/mystery-man.svg",
      system: {
        className: entry.className,
        pathKey: entry.pathKey,
        features: entry.features ?? {},
        description: entry.descriptionHtml
          ?? `<p>${escapeHtml(SUBCLASS_FLAVOR?.[entry.pathKey] ?? "")}</p>`,
      },
      effects: [],
      flags: { tesshari: { sourceKey: `${entry.className}::${entry.pathKey}` } },
      folder: null,
      sort: 0,
      ownership: { default: 0 },
    };

    writeDoc(outDir, `subclass_${entry.className}_${entry.pathKey}`.toLowerCase().replace(/[^a-z0-9]+/g, "_"), doc);
    count++;
  }

  return count;
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

  console.log(`\nParsing class + race markdown from ${REPO_ROOT}/classes and /races ...`);
  const { cards: mdCards, counts } = loadAllMarkdownCards(REPO_ROOT);
  console.log(`  class cards:  ${counts.classes}`);
  console.log(`  race cards:   ${counts.races}`);
  console.log(`  unique keys:  ${counts.total}`);

  const cardsDir     = path.join(PACKS_SRC, "cards");
  const itemsDir     = path.join(PACKS_SRC, "items");
  const racesDir     = path.join(PACKS_SRC, "races");
  const classesDir   = path.join(PACKS_SRC, "classes");
  const subclassesDir = path.join(PACKS_SRC, "subclasses");

  const cardsResult = buildCardsPack(data, mdCards, cardsDir);
  console.log(`\nWrote ${cardsResult.count} card documents (${cardsResult.enriched} enriched from markdown) → ${path.relative(ROOT, cardsDir)}`);

  const itemsCount = buildItemsPack(data, itemsDir);
  console.log(`Wrote ${itemsCount} item documents → ${path.relative(ROOT, itemsDir)}`);

  const raceCount = buildRacePack(data, REPO_ROOT, racesDir);
  console.log(`Wrote ${raceCount} race documents → ${path.relative(ROOT, racesDir)}`);

  const classCount = buildClassPack(data, REPO_ROOT, classesDir);
  console.log(`Wrote ${classCount} class documents → ${path.relative(ROOT, classesDir)}`);

  const subclassCount = buildSubclassPack(data, REPO_ROOT, subclassesDir);
  console.log(`Wrote ${subclassCount} subclass documents → ${path.relative(ROOT, subclassesDir)}`);

  console.log("\nNext: run `npm run pack:all` to compile JSON → LevelDB.");
}

main();
