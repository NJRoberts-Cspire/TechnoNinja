/**
 * Parse card reference blocks out of class + race markdown files.
 *
 * Block format (from classes/01_ironclad_samurai.md et al):
 *
 *   ### Blade of Obligation
 *   *Tier 3 (3 AP) | Signature*
 *
 *   **Effect:** Your resonant blade ... Deal 22 + IRON damage. Apply Bleed 3 and Expose 2.
 *   **Keywords:** Bleed 3, Expose 2, Pierce 6
 *   **Unlock:** Level 18
 *
 * The italic metadata line is pipe-separated; passive cards use `*Tier 0 | Passive*`
 * and race cards append `| Race: The Forged`. Bodies may use `Effect:` or
 * `Always Active:` for passives.
 */

import fs from "node:fs";
import path from "node:path";

/* ────────────────────────────────────────────────────────────────────────
 * Normalization
 * ──────────────────────────────────────────────────────────────────────── */

/** Strip non-alphanumerics and lower-case so "Blade of Obligation" matches "blade_of_obligation". */
export function normalizeName(name) {
  return String(name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

const CATEGORY_MAP = {
  attack: "attack", melee: "attack", ranged: "attack", signal: "attack", resonant: "attack",
  defense: "defense", control: "control", power: "power", reaction: "reaction",
  passive: "passive", mobility: "mobility", utility: "utility", signature: "signature", boss: "boss",
};

/** Map a human category string ("Signature", "Melee Attack", …) to our enum. */
function mapCategory(raw) {
  const s = String(raw ?? "").toLowerCase().trim();
  if (CATEGORY_MAP[s]) return CATEGORY_MAP[s];
  for (const [k, v] of Object.entries(CATEGORY_MAP)) {
    if (s.includes(k)) return v;
  }
  return "utility";
}

/* ────────────────────────────────────────────────────────────────────────
 * Individual card parsing
 * ──────────────────────────────────────────────────────────────────────── */

function parseTierLine(text) {
  // "Tier 3 (3 AP) | Signature" → { tier: 3, apCost: 3, category: "signature", race: null }
  // "Tier 0 | Passive"          → { tier: 0, apCost: 0, category: "passive",   race: null }
  // "Tier 1 (1 AP) | Defense | Race: The Forged" → { tier:1, apCost:1, category:"defense", race:"The Forged" }
  const parts = String(text).split("|").map(s => s.trim());
  const tierPart = parts[0] ?? "";
  const categoryPart = parts[1] ?? "";
  const rest = parts.slice(2);

  const tierMatch = tierPart.match(/Tier\s+(\d+)(?:\s*\(\s*(\d+)\s*AP\s*\))?/i);
  const tier = tierMatch ? parseInt(tierMatch[1], 10) : null;
  const apCost = tierMatch && tierMatch[2] != null ? parseInt(tierMatch[2], 10) : (tier ?? 0);

  const raceLine = rest.find(p => /^Race:/i.test(p));
  const race = raceLine ? raceLine.replace(/^Race:\s*/i, "").trim() : null;

  return {
    tier,
    apCost,
    category: mapCategory(categoryPart),
    categoryRaw: categoryPart,
    race,
  };
}

/** Pull "Deal 22 + IRON + RESONANCE damage" out of the effect text. */
function extractDamage(effect) {
  if (!effect) return null;
  // Permit "Deal 22 + IRON damage" and "Deal 22 + IRON + RESONANCE damage"
  const m = effect.match(/Deal\s+(\d+)\s*\+\s*([A-Z]+)(?:\s*\+\s*([A-Z]+))?\s*damage/i);
  if (!m) return null;
  return {
    base: parseInt(m[1], 10),
    stat: (m[2] ?? "").toLowerCase(),
    secondStat: m[3] ? m[3].toLowerCase() : null,
  };
}

/** Split a Keywords line into clean entries. Handles "Echo (on next attack)" → "Echo". */
function parseKeywordLine(raw) {
  if (!raw || raw.trim() === "" || /^[—–-]$/.test(raw.trim())) return [];
  return raw
    .split(",")
    .map(s => s.trim())
    // Strip trailing parenthetical qualifiers
    .map(s => s.replace(/\s*\([^)]*\)\s*$/, "").trim())
    .filter(Boolean);
}

/** Pull "Level 18" (or first number) out of an Unlock line. */
function parseUnlockLevel(raw) {
  if (!raw) return null;
  const m = raw.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

/** Check if the unlock line flags the card as Starting Hand. */
function isStartingHand(unlockRaw) {
  return /starting hand/i.test(unlockRaw ?? "");
}

/**
 * Parse one chunk starting at `### <Name>`. Returns null if the chunk isn't a
 * card-reference block (e.g. "### Starting Hand", "### Level Unlock List").
 */
function parseCardChunk(chunk, className) {
  const lines = chunk.split("\n");
  const nameMatch = lines[0].match(/^### (.+?)\s*$/);
  if (!nameMatch) return null;
  const name = nameMatch[1].trim();

  // Skip section-navigation headings
  if (/^(starting hand|level unlock list|full card reference|subclass|path|overview|card system)/i.test(name)) {
    return null;
  }

  // The italic metadata line must be within the first few lines
  let italic = null;
  let italicLineIdx = -1;
  for (let i = 1; i < Math.min(lines.length, 5); i++) {
    const m = lines[i].match(/^\*(.+)\*\s*$/);
    if (m) { italic = m[1]; italicLineIdx = i; break; }
  }
  if (!italic) return null;

  const tierInfo = parseTierLine(italic);

  // Body text after the italic line
  const body = lines.slice(italicLineIdx + 1).join("\n");

  const section = (label) => {
    const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`);
    const m = body.match(re);
    return m ? m[1].trim() : null;
  };

  const effect = section("Effect") ?? section("Always Active");
  const keywordsRaw = section("Keywords");
  const unlockRaw = section("Unlock");

  const damage = extractDamage(effect);
  const keywords = parseKeywordLine(keywordsRaw);
  const unlockLevel = parseUnlockLevel(unlockRaw);
  const startingHand = isStartingHand(unlockRaw);

  return {
    name,
    nameKey: normalizeName(name),
    className: tierInfo.race ? null : className,
    race: tierInfo.race,
    tier: tierInfo.tier,
    apCost: tierInfo.apCost,
    category: tierInfo.category,
    categoryRaw: tierInfo.categoryRaw,
    effect: effect ?? "",
    baseDamage: damage?.base ?? null,
    primaryStat: damage?.stat ?? null,
    secondaryStat: damage?.secondStat ?? null,
    keywords,
    unlockLevel,
    startingHand,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Whole-file parsing
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Parse every card block out of a markdown file, keyed by normalized name.
 * The className is provided externally (from the filename).
 */
export function parseMarkdownCards(filePath, className) {
  const md = fs.readFileSync(filePath, "utf8");
  // Split on "### " at start-of-line; first piece is pre-content, skip.
  const chunks = md.split(/\n### /);
  const cards = {};
  for (let i = 1; i < chunks.length; i++) {
    const chunk = "### " + chunks[i];
    const card = parseCardChunk(chunk, className);
    if (!card) continue;
    cards[card.nameKey] = card;
  }
  return cards;
}

/* ────────────────────────────────────────────────────────────────────────
 * Bulk loader — loads every class + race file
 * ──────────────────────────────────────────────────────────────────────── */

const CLASS_FILE_TO_NAME = {
  "01_ironclad_samurai.md": "Ironclad Samurai",
  "02_ronin.md":            "Ronin",
  "03_ashfoot.md":          "Ashfoot",
  "04_veilblade.md":        "Veilblade",
  "05_oni_hunter.md":       "Oni Hunter",
  "06_forge_tender.md":     "Forge Tender",
  "07_wireweave.md":        "Wireweave",
  "08_chrome_shaper.md":    "Chrome Shaper",
  "09_pulse_caller.md":     "Pulse Caller",
  "10_iron_monk.md":        "Iron Monk",
  "11_echo_speaker.md":     "Echo Speaker",
  "12_void_walker.md":      "Void Walker",
  "13_sutensai.md":         "Sutensai",
  "14_flesh_shaper.md":     "Flesh Shaper",
  "15_puppet_binder.md":    "Puppet Binder",
  "16_blood_smith.md":      "Blood Smith",
  "17_the_hollow.md":       "The Hollow",
  "18_shadow_daimyo.md":    "Shadow Daimyo",
  "19_voice_of_debt.md":    "Voice of Debt",
  "20_merchant_knife.md":   "Merchant Knife",
  "21_iron_herald.md":      "Iron Herald",
  "22_curse_eater.md":      "Curse Eater",
  "23_shell_dancer.md":     "Shell Dancer",
  "24_fracture_knight.md":  "Fracture Knight",
  "25_the_unnamed.md":      "The Unnamed",
};

const RACE_FILE_TO_NAME = {
  "01_the_forged.md":       "The Forged",
  "02_the_tethered.md":     "The Tethered",
  "03_the_echoed.md":       "The Echoed",
  "04_the_wireborn.md":     "The Wireborn",
  "05_the_stitched.md":     "The Stitched",
  "06_the_shellbroken.md":  "The Shellbroken",
  "07_the_iron_blessed.md": "The Iron Blessed",
  "08_the_diminished.md":   "The Diminished",
};

/**
 * Load every class + race markdown and return a merged nameKey → card map.
 * Later entries overwrite earlier, but duplicates across files are rare.
 */
export function loadAllMarkdownCards(repoRoot) {
  const merged = {};
  const counts = { classes: 0, races: 0, total: 0 };

  for (const [file, name] of Object.entries(CLASS_FILE_TO_NAME)) {
    const fp = path.join(repoRoot, "classes", file);
    if (!fs.existsSync(fp)) continue;
    const cards = parseMarkdownCards(fp, name);
    counts.classes += Object.keys(cards).length;
    Object.assign(merged, cards);
  }

  for (const [file, name] of Object.entries(RACE_FILE_TO_NAME)) {
    const fp = path.join(repoRoot, "races", file);
    if (!fs.existsSync(fp)) continue;
    const cards = parseMarkdownCards(fp, null);
    for (const card of Object.values(cards)) card.race = name.replace(/^The\s+/, "");
    counts.races += Object.keys(cards).length;
    Object.assign(merged, cards);
  }

  counts.total = Object.keys(merged).length;
  return { cards: merged, counts };
}

/* ────────────────────────────────────────────────────────────────────────
 * Race + class + subclass section extraction (not cards)
 * ──────────────────────────────────────────────────────────────────────── */

/** Lightweight Markdown → HTML — paragraphs + **bold** + bullet lists. */
function mdToHtml(md) {
  if (!md) return "";
  const text = String(md).trim();
  // Split on blank lines into blocks
  const blocks = text.split(/\n\s*\n/);
  const html = blocks.map(block => {
    const lines = block.trim().split("\n");
    if (lines.every(l => /^\s*-\s+/.test(l))) {
      const items = lines.map(l => l.replace(/^\s*-\s+/, "").trim())
        .map(i => `<li>${inline(i)}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    return `<p>${inline(block.replace(/\n/g, " "))}</p>`;
  }).join("\n");
  return html;

  function inline(s) {
    return s
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
}

/**
 * Pull the text between `## Heading` or `### Heading` through the next heading of
 * same-or-higher level. Returns null if the heading isn't found.
 */
function sliceHeading(md, headingText, level = 3) {
  const marker = "#".repeat(level) + " ";
  const start = md.indexOf(`\n${marker}${headingText}`);
  if (start < 0) return null;
  const bodyStart = md.indexOf("\n", start + 1) + 1;
  // Next heading of the same or higher level terminates the section
  const stopRe = level >= 2
    ? new RegExp(`\\n#{1,${level}}\\s`, "g")
    : /\n#{1,2}\s/g;
  stopRe.lastIndex = bodyStart;
  const m = stopRe.exec(md);
  const end = m ? m.index : md.length;
  return md.slice(bodyStart, end).trim();
}

/** Read a race markdown file, extract description + passive traits as HTML. */
export function loadRaceSections(repoRoot) {
  const out = {};
  for (const [file, displayName] of Object.entries(RACE_FILE_TO_NAME)) {
    const fp = path.join(repoRoot, "races", file);
    if (!fs.existsSync(fp)) continue;
    const md = fs.readFileSync(fp, "utf8");

    const overview = sliceHeading(md, "Overview", 2) ?? "";
    const passives = sliceHeading(md, "Passive Traits", 3) ?? "";
    // Extract heritage branch names if present under "Heritage" or similar
    const heritage = sliceHeading(md, "Heritage Branches", 3)
                  ?? sliceHeading(md, "Heritage", 3)
                  ?? "";
    const heritageBranches = (heritage.match(/\*\*([^*]+)\*\*/g) ?? [])
      .map(s => s.replace(/\*\*/g, "").trim())
      .filter(Boolean);

    const key = displayName.replace(/^The\s+/, "");  // "Forged", "Iron Blessed"
    out[key] = {
      displayName: key,
      fullDisplayName: displayName,
      descriptionHtml: mdToHtml(overview),
      passivesHtml:    mdToHtml(passives),
      heritageBranches,
    };
  }
  return out;
}

/** Read a class markdown file, extract overview + starting hand + subclass features. */
export function loadClassSections(repoRoot) {
  const classes = {};
  const subclasses = {};

  for (const [file, className] of Object.entries(CLASS_FILE_TO_NAME)) {
    const fp = path.join(repoRoot, "classes", file);
    if (!fs.existsSync(fp)) continue;
    const md = fs.readFileSync(fp, "utf8");

    const overview = sliceHeading(md, "Overview", 2) ?? "";
    const startingHandSection = sliceHeading(md, "Starting Hand", 3) ?? "";
    const startingHand = startingHandSection
      .split("\n")
      .map(l => l.match(/^-\s+\*\*([^*]+)\*\*/)?.[1] ?? l.match(/^-\s+([^—\n]+)/)?.[1])
      .filter(Boolean)
      .map(s => s.trim());

    classes[className] = {
      className,
      descriptionHtml: mdToHtml(overview),
      startingHand,
    };

    // Subclass sections under "## Subclasses"
    const subBlock = sliceHeading(md, "Subclasses", 2) ?? "";
    // Split at `### ` subclass heading lines
    const subChunks = subBlock.split(/\n### /).slice(1);
    for (const chunk of subChunks) {
      const headingLine = chunk.split("\n")[0];
      const nameMatch = headingLine.match(/^([^—]+?)(?:\s*—|$)/);
      const displayName = nameMatch ? nameMatch[1].trim() : headingLine.trim();
      const body = chunk.split("\n").slice(1).join("\n").trim();

      // Parse features at levels 3, 6, 10, 14 (and occasionally 18)
      const features = {};
      const featureRe = /\*\*Level\s+(\d+):\s*([^*]+)\*\*\s*\n([\s\S]*?)(?=\n\*\*Level\s+\d+:|$)/g;
      let m;
      while ((m = featureRe.exec(body)) !== null) {
        const level = parseInt(m[1], 10);
        features[String(level)] = {
          name: m[2].trim(),
          html: mdToHtml(m[3].trim()),
        };
      }

      // Subclass key — slugified display name (matches SUBCLASS_BY_CLASS shape)
      const pathKey = displayName.toLowerCase()
        .replace(/^oath of the\s+/, "oath_")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

      subclasses[`${className}::${displayName}`] = {
        className,
        displayName,
        pathKey,
        descriptionHtml: mdToHtml(body.split(/\n\*\*Level/)[0]),
        features,
      };
    }
  }

  return { classes, subclasses };
}
