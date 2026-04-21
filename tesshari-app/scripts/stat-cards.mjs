// Parses fully-statted card blocks out of classes/*.md and races/*.md and
// emits questbound/import_tsv/aligned_for_qb/actions_STATTED.tsv.
//
// Card blocks look like:
//   ### Card Name
//   *Tier X (Y AP) | Category*
//
//   **Effect:** ...
//   **Keywords:** ...
//   **Unlock:** Level N
//
// Run: node scripts/stat-cards.mjs  (from tesshari-app/)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const CLASS_DIR = path.join(REPO_ROOT, 'classes');
const RACE_DIR = path.join(REPO_ROOT, 'races');
const OUT = path.join(REPO_ROOT, 'questbound/import_tsv/aligned_for_qb/actions_STATTED.tsv');
const PASSIVES_OUT = path.join(APP_ROOT, 'src/data/passives.generated.json');

const CLASS_FILE_TO_PREFIX = {
  '01_ironclad_samurai.md': 'ironclad',
  '02_ronin.md': 'ronin',
  '03_ashfoot.md': 'ashfoot',
  '04_veilblade.md': 'veilblade',
  '05_oni_hunter.md': 'oni_hunter',
  '06_forge_tender.md': 'forge_tender',
  '07_wireweave.md': 'wireweave',
  '08_chrome_shaper.md': 'chrome_shaper',
  '09_pulse_caller.md': 'pulse_caller',
  '10_iron_monk.md': 'iron_monk',
  '11_echo_speaker.md': 'echo_speaker',
  '12_void_walker.md': 'void_walker',
  '13_sutensai.md': 'sutensai',
  '14_flesh_shaper.md': 'flesh_shaper',
  '15_puppet_binder.md': 'puppet_binder',
  '16_blood_smith.md': 'blood_smith',
  '17_the_hollow.md': 'hollow',
  '18_shadow_daimyo.md': 'shadow_daimyo',
  '19_voice_of_debt.md': 'voice_of_debt',
  '20_merchant_knife.md': 'merchant_knife',
  '21_iron_herald.md': 'iron_herald',
  '22_curse_eater.md': 'curse_eater',
  '23_shell_dancer.md': 'shell_dancer',
  '24_fracture_knight.md': 'fracture_knight',
  '25_the_unnamed.md': 'unnamed',
};

const RACE_FILE_TO_PREFIX = {
  '01_the_forged.md': 'forged',
  '02_the_tethered.md': 'tethered',
  '03_the_echoed.md': 'echoed',
  '04_the_wireborn.md': 'wireborn',
  '05_the_stitched.md': 'stitched',
  '06_the_shellbroken.md': 'shellbroken',
  '07_the_iron_blessed.md': 'iron_blessed',
  '08_the_diminished.md': 'diminished',
};

function slug(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseTypeLine(line) {
  // Matches "*Tier 1 (1 AP) | Passive*", "> Tier 1 (1 AP) | Passive",
  // and "**Tier 2 (2 AP) | Mobility | Race Card**".
  const cleaned = line.replace(/^[>*\s]+|[*\s]+$/g, '').trim();
  const m = cleaned.match(/^Tier (\d)(?:\s*\((\d+)\s*AP\))?\s*\|\s*([^|]+?)(?:\s*\|\s*(.+))?$/);
  if (!m) return null;
  return {
    tier: parseInt(m[1], 10),
    apCost: m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10),
    cardType: m[3].trim(),
    meta: m[4] ? m[4].trim() : '',
  };
}

/**
 * Block-style parser for `### Card Name` sections followed by a `*Tier X...*`
 * or `> Tier X...` line and labelled body fields.
 */
function parseCardBlocks(md) {
  const out = [];
  // Split on level-3 OR level-4 headings. We also need to know whether each
  // section sits under a "Starting Hand" super-header — so walk sequentially.
  const headingRe = /\r?\n(#{2,4}) ([^\r\n]+)/g;
  const headings = [];
  let mh;
  while ((mh = headingRe.exec(md)) !== null) {
    headings.push({ level: mh[1].length, title: mh[2].trim(), index: mh.index });
  }
  // For each level-3+ heading, capture its body and whether a Starting Hand
  // ancestor heading is currently active.
  let underStartingHand = false;
  for (let i = 0; i < headings.length; i += 1) {
    const h = headings[i];
    const next = headings[i + 1];
    const bodyStart = h.index + h.title.length + h.level + 2; // heading + "# " + "\n"
    const body = md.slice(bodyStart, next ? next.index : md.length);
    // Re-evaluate ancestor state for each heading.
    if (/Starting Hand/i.test(h.title)) {
      underStartingHand = true;
    } else if (h.level <= 3) {
      // a sibling or higher heading clears the "under Starting Hand" flag
      underStartingHand = false;
    }
    const title = h.title.replace(/\*/g, '').trim();
    if (!title) continue;
    const typeLineMatch = body.match(/^(?:\*\*Tier \d[^*]*\*\*|\*Tier \d[^*]*\*|>\s*Tier \d.*)\s*$/m);
    if (!typeLineMatch) continue;
    const t = parseTypeLine(typeLineMatch[0]);
    if (!t) continue;

    const pick = (label) => {
      const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]+?)(?:\\n\\s*\\n|\\n\\*\\*|\\n---|$)`);
      const m = body.match(re);
      return m ? m[1].trim().replace(/\s+/g, ' ') : '';
    };

    const effect = pick('Effect') || pick('Always Active') || pick('Triggered') || pick('When Played') || pick('Use');
    const keywords = pick('Keywords');
    const unlock = pick('Unlock');

    out.push({
      title,
      tier: t.tier,
      apCost: t.apCost,
      cardType: t.cardType,
      meta: t.meta,
      effect,
      keywordsRaw: keywords,
      unlockRaw: unlock,
      startingHand: underStartingHand,
    });
  }
  return out;
}

/**
 * Compact inline-paragraph parser used by classes 13–25. Each card is a single
 * paragraph like:
 *   **Card Name** — Tier X (Y AP) | Category: effect text. *Unlock: Level N*
 * Some cards span multiple lines within a paragraph.
 */
function parseCompactCards(md) {
  const out = [];
  const lines = md.split(/\r?\n/);
  let currentUnlock = null; // level from the nearest `#### Level N` header above
  let buf = [];

  const flush = () => {
    if (buf.length === 0) return;
    const c = buf.join(' ').trim();
    buf = [];
    const m = c.match(/^\*\*([^*]+)\*\*\s*[—–-]\s*Tier (\d)(?:\s*\((\d+)\s*AP\))?\s*\|\s*([^:]+?):\s*([\s\S]+?)(?:\*Unlock:\s*(Level\s+\d+[^*]*)\*\s*)?$/);
    if (!m) return;
    const title = m[1].replace(/^\[[^\]]+\]\s*/, '').trim(); // strip [Empty]/[Shell] prefix
    const tier = parseInt(m[2], 10);
    const apCost = m[3] ? parseInt(m[3], 10) : tier;
    const cardType = m[4].trim();
    let effect = m[5].trim().replace(/\s+/g, ' ');
    effect = effect.replace(/\*Unlock:[^*]*\*\.?$/, '').trim();
    let unlockRaw = m[6] ? m[6].trim() : '';
    // Fall back to the enclosing `#### Level N` header when no explicit
    // `*Unlock:* marker is present on the card line itself.
    if (!unlockRaw && currentUnlock !== null) {
      unlockRaw = `Level ${currentUnlock}`;
    }
    out.push({ title, tier, apCost, cardType, meta: '', effect, keywordsRaw: '', unlockRaw });
  };

  for (const line of lines) {
    // Header `#### Level N` (or `### Level N`) sets the unlock context.
    const levelHeader = line.match(/^#{2,4}\s+Level\s+(\d+)\b/i);
    if (levelHeader) {
      flush();
      currentUnlock = parseInt(levelHeader[1], 10);
      continue;
    }
    // Any other heading line clears the context — cards beneath it either
    // carry their own `*Unlock:` marker or are out-of-scope.
    if (/^#{1,4}\s+\S/.test(line)) {
      flush();
      currentUnlock = null;
      continue;
    }
    // Blank lines end any in-progress card paragraph.
    if (line.trim() === '') {
      flush();
      continue;
    }
    const isCardStart =
      /^\s*-\s*\*\*/.test(line) ||
      /^\*\*[^*]+\*\*\s*[—–-]\s*Tier \d/.test(line.trim());
    if (isCardStart) {
      flush();
      buf = [line.trim().replace(/^-\s*/, '')];
    } else if (buf.length) {
      buf.push(line.trim());
    }
  }
  flush();
  return out;
}

function parseCards(md) {
  // Return ALL parses — both block- and compact-format hits for the same card
  // are useful because addCard() merges them (e.g., one format may carry the
  // long effect text while the other carries the Unlock level).
  return [...parseCardBlocks(md), ...parseCompactCards(md)];
}

function extractDamage(effect) {
  // "Deal 10 + IRON damage" / "deals 20 + RESONANCE resonant damage" / "Deal 8 damage"
  const m = effect.match(/[Dd]eal(?:s)?\s+(\d+)(?:\s*\+\s*([A-Z]+))?(?:\s*\+\s*([A-Z]+))?(?:\s+[a-z]+)?\s+damage/);
  if (!m) return { baseDamage: null, damageStat: null };
  // Take the first stat found; if two (e.g. "+ IRON + RESONANCE"), join with '+'.
  const stat = [m[2], m[3]].filter(Boolean).join('+');
  return { baseDamage: parseInt(m[1], 10), damageStat: stat || null };
}

function extractKeywords(line) {
  if (!line || line === '—' || line === '-' || line.toLowerCase() === 'none') return [];
  return line
    .split(/\s*,\s*/)
    .map((kw) => {
      const m = kw.match(/^([A-Z][A-Za-z]+)(?:\s+(\d+))?(?:\s*\(.*\))?$/);
      if (!m) return null;
      return { name: m[1], value: m[2] ? parseInt(m[2], 10) : null };
    })
    .filter(Boolean);
}

/** Scan effect prose for keyword mentions when no explicit Keywords line exists. */
const CANONICAL_KEYWORDS = [
  'Guard', 'Shield', 'Fortify', 'Regen', 'Veil',
  'Bleed', 'Burn', 'Expose', 'Vulnerable', 'Overheat',
  'Stagger', 'Root', 'Silence', 'Taunt', 'Mark',
  'Pierce', 'Echo', 'Overclock', 'Cleanse', 'Dispel',
];

function extractKeywordsFromEffect(effect) {
  const out = [];
  const seen = new Set();
  for (const kw of CANONICAL_KEYWORDS) {
    // Match "Guard 5", "Apply Expose 3", "Apply Silence", etc. (word boundary, optional number)
    const re = new RegExp(`\\b${kw}(?:\\s+(\\d+))?\\b`, 'g');
    let best = null;
    let m;
    while ((m = re.exec(effect)) !== null) {
      const val = m[1] ? parseInt(m[1], 10) : null;
      if (!best || (val !== null && (best.value === null || val > best.value))) {
        best = { name: kw, value: val };
      }
    }
    if (best && !seen.has(kw)) {
      out.push(best);
      seen.add(kw);
    }
  }
  return out;
}

function extractUnlockLevel(line) {
  if (!line) return null;
  const m = line.match(/Level\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function categoryFor(tier, unlockLevel, cardType) {
  if (cardType.toLowerCase() === 'passive') return 'passive';
  if (unlockLevel >= 20) return 'capstone';
  if (unlockLevel >= 9) return 'subclass_power';
  if (unlockLevel >= 5) return 'power';
  if (unlockLevel >= 3) return 'subclass';
  if (unlockLevel >= 2) return 'level_up';
  return 'core_ability';
}

function escapeTsv(s) {
  return String(s).replace(/\t/g, ' ').replace(/\r?\n/g, ' ').replace(/"/g, '""');
}

const rowsById = new Map();

function addCard({ prefix, card, aiTag }) {
  const id = `card_${prefix}_${slug(card.title)}`;

  const { baseDamage, damageStat } = extractDamage(card.effect);
  const explicitKeywords = extractKeywords(card.keywordsRaw);
  const keywords = explicitKeywords.length > 0
    ? explicitKeywords
    : extractKeywordsFromEffect(card.effect);
  const unlockLevel = extractUnlockLevel(card.unlockRaw);
  const category = categoryFor(card.tier, unlockLevel ?? 1, card.cardType);

  // Starting-hand detection: source unlock line explicitly says "Starting Hand"
  // or "Starting Card", or the Tesshari "Starting Hand" header sat above this
  // card in the class markdown.
  const isStartingHand =
    /Starting (Hand|Card)/i.test(card.unlockRaw || '') ||
    card.startingHand === true;

  const cp = {
    apCost: String(card.apCost),
    playLimitPerTurn: '1',
    isCard: 'true',
    isBasicAttack: 'false',
    aiTag: aiTag || '',
    tier: String(card.tier),
    cardType: card.cardType,
    baseDamage: baseDamage === null ? '' : String(baseDamage),
    damageStat: damageStat || '',
    keywords: keywords.map((k) => (k.value !== null ? `${k.name} ${k.value}` : k.name)).join('|'),
    unlockLevel: unlockLevel !== null ? String(unlockLevel) : '',
    startingHand: isStartingHand ? 'true' : '',
  };

  const candidate = {
    id,
    title: card.title,
    description: card.effect || '—',
    category,
    customProperties: cp,
  };

  // Merge against any existing row: keep the version with the richest data.
  const existing = rowsById.get(id);
  if (!existing) {
    rowsById.set(id, candidate);
    return;
  }

  const merged = { ...existing };
  // Prefer the longer description.
  if (candidate.description.length > existing.description.length) {
    merged.description = candidate.description;
  }
  // For each customProperty, prefer the non-empty value, and for unlockLevel
  // prefer a non-'1' value (Level 1 is our fallback; real L1 cards also
  // have unlockLevel='1' so this is best-effort — but it correctly replaces
  // the fallback when the other parse had '' and this one has a real number).
  const mergedCp = { ...existing.customProperties };
  for (const [k, v] of Object.entries(candidate.customProperties)) {
    if (!v) continue;
    const cur = mergedCp[k];
    if (!cur || cur === '') {
      mergedCp[k] = v;
    } else if (k === 'keywords' && v.length > cur.length) {
      mergedCp[k] = v;
    } else if (k === 'unlockLevel' && v !== '' && (cur === '' || cur === '1')) {
      // Prefer an explicit non-1 unlock over the unknown fallback.
      mergedCp[k] = v;
    } else if (k === 'baseDamage' && cur === '' && v !== '') {
      mergedCp[k] = v;
    } else if (k === 'startingHand' && v === 'true') {
      mergedCp[k] = 'true';
    }
  }
  merged.customProperties = mergedCp;
  // Recompute category from merged unlock level.
  merged.category = categoryFor(Number(mergedCp.tier || 0), Number(mergedCp.unlockLevel || 1), mergedCp.cardType || '');
  rowsById.set(id, merged);
}

/**
 * Extract the passive-traits list from a race or class markdown file.
 * Targets the "### Passive Traits" (or "## Passive Traits") section and returns
 * entries of the form: `{ name, description }` parsed from either
 * `**Name.** body` or `- **Name:** body` or `- **Name.** body`.
 */
function parsePassives(md) {
  const out = [];
  const sec = md.match(/\r?\n#{2,4}\s+Passive Traits\r?\n([\s\S]+?)(?=\r?\n#{2,4}\s|$)/);
  if (!sec) return out;
  const body = sec[1];
  // Each passive: either line starts with `- **Name.**` / `- **Name:**` or `**Name.**` with no bullet.
  const lineBlocks = body.split(/\r?\n\r?\n/);
  for (const blk of lineBlocks) {
    const trimmed = blk.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^-?\s*\*\*([^*]+?)[.:]\*\*\s*([\s\S]+)$/);
    if (!m) continue;
    const name = m[1].trim();
    const description = m[2].replace(/\s+/g, ' ').trim();
    out.push({ name, description });
  }
  return out;
}

const racePassives = {};
const classPassives = {};

// Classes
for (const [file, prefix] of Object.entries(CLASS_FILE_TO_PREFIX)) {
  const p = path.join(CLASS_DIR, file);
  if (!fs.existsSync(p)) {
    console.warn(`missing: ${p}`);
    continue;
  }
  const md = fs.readFileSync(p, 'utf8');
  const cards = parseCards(md);
  for (const card of cards) {
    addCard({ prefix, card, aiTag: `class:${prefix}` });
  }
  classPassives[prefix] = parsePassives(md);
  console.log(`  ${file}: ${cards.length} cards, ${classPassives[prefix].length} passives`);
}

// Races
for (const [file, prefix] of Object.entries(RACE_FILE_TO_PREFIX)) {
  const p = path.join(RACE_DIR, file);
  if (!fs.existsSync(p)) {
    console.warn(`missing: ${p}`);
    continue;
  }
  const md = fs.readFileSync(p, 'utf8');
  const cards = parseCards(md);
  for (const card of cards) {
    addCard({ prefix, card, aiTag: `race:${prefix}` });
  }
  racePassives[prefix] = parsePassives(md);
  console.log(`  ${file}: ${cards.length} cards, ${racePassives[prefix].length} passives`);
}

// Map race prefixes (forged/tethered/…) to the display names used in the app.
const RACE_PREFIX_TO_NAME = {
  forged: 'Forged', tethered: 'Tethered', echoed: 'Echoed', wireborn: 'Wireborn',
  stitched: 'Stitched', shellbroken: 'Shellbroken', iron_blessed: 'Iron Blessed', diminished: 'Diminished',
};
const CLASS_PREFIX_TO_NAME = {
  ironclad: 'Ironclad Samurai', ronin: 'Ronin', iron_monk: 'Iron Monk',
  fracture_knight: 'Fracture Knight', ashfoot: 'Ashfoot', veilblade: 'Veilblade',
  oni_hunter: 'Oni Hunter', shell_dancer: 'Shell Dancer', curse_eater: 'Curse Eater',
  hollow: 'The Hollow', forge_tender: 'Forge Tender', wireweave: 'Wireweave',
  chrome_shaper: 'Chrome Shaper', pulse_caller: 'Pulse Caller', sutensai: 'Sutensai',
  flesh_shaper: 'Flesh Shaper', echo_speaker: 'Echo Speaker', void_walker: 'Void Walker',
  blood_smith: 'Blood Smith', iron_herald: 'Iron Herald', shadow_daimyo: 'Shadow Daimyo',
  voice_of_debt: 'Voice of Debt', merchant_knife: 'Merchant Knife', puppet_binder: 'Puppet Binder',
  unnamed: 'The Unnamed',
};

const racePassivesByName = {};
for (const [prefix, list] of Object.entries(racePassives)) {
  racePassivesByName[RACE_PREFIX_TO_NAME[prefix] || prefix] = list;
}
const classPassivesByName = {};
for (const [prefix, list] of Object.entries(classPassives)) {
  classPassivesByName[CLASS_PREFIX_TO_NAME[prefix] || prefix] = list;
}

fs.writeFileSync(
  PASSIVES_OUT,
  JSON.stringify({ race: racePassivesByName, class: classPassivesByName }, null, 2),
  'utf8',
);
console.log(`\nWrote passives to ${PASSIVES_OUT}`);

const header = 'id\ttitle\tdescription\tcategory\tinventoryHeight\tinventoryWidth\timage\tcustomProperties\n';
const rows = Array.from(rowsById.values());
const body = rows
  .map((r) => `${r.id}\t${escapeTsv(r.title)}\t${escapeTsv(r.description)}\t${r.category}\t\t\t\t"${escapeTsv(JSON.stringify(r.customProperties))}"`)
  .join('\n');

fs.writeFileSync(OUT, header + body + '\n', 'utf8');
console.log(`\nWrote ${rows.length} statted cards to ${OUT}`);
