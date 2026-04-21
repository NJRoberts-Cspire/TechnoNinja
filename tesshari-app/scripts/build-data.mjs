// Reads Tesshari TSVs + class markdown docs, emits src/data/generated.ts
// Run via `npm run data` (or automatically before dev/build).
//
// Inputs:
//   ../questbound/import_tsv/aligned_for_qb/{attributes,actions,items}_READY.tsv
//   ../tesshari_v2/documents/*.md  (one per class + an overview)
//
// Output: src/data/generated.ts with strongly-typed constants.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..');
const SRC_TSV = path.join(REPO_ROOT, 'questbound/import_tsv/aligned_for_qb');
const SRC_DOCS = path.join(REPO_ROOT, 'tesshari_v2/documents');
const OUT = path.join(ROOT, 'src/data/generated.ts');

// ─── TSV parsing ───────────────────────────────────────────────────────
function unescapeCell(s) {
  if (!s) return '';
  s = s.replace(/\r$/, '');
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}
function parseTsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = lines[0].split('\t').map((h) => h.replace(/\r$/, ''));
  return lines.slice(1).map((line) => {
    const cells = line.split('\t');
    const row = {};
    headers.forEach((h, i) => (row[h] = unescapeCell(cells[i] ?? '')));
    return row;
  });
}
function parseOptions(raw) {
  if (!raw || raw === '[]') return [];
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try { return JSON.parse(s); } catch { /* fall through */ }
  }
  if (s.includes('|')) return s.split('|').map((x) => x.trim()).filter(Boolean);
  return [s];
}
function humanize(slug) {
  return String(slug).split('_').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');
}

// ─── Constants (matches build_v2.js) ───────────────────────────────────
const SPECIES = ['Forged', 'Tethered', 'Echoed', 'Wireborn', 'Stitched', 'Shellbroken', 'Iron Blessed', 'Diminished'];
const CLASSES = [
  'Ironclad Samurai', 'Ronin', 'Iron Monk', 'Fracture Knight', 'Ashfoot', 'Veilblade', 'Oni Hunter',
  'Shell Dancer', 'Curse Eater', 'The Hollow', 'Forge Tender', 'Wireweave', 'Chrome Shaper',
  'Pulse Caller', 'Sutensai', 'Flesh Shaper', 'Echo Speaker', 'Void Walker', 'Blood Smith',
  'Iron Herald', 'Shadow Daimyo', 'Voice of Debt', 'Merchant Knife', 'Puppet Binder', 'The Unnamed',
];
const SUBCLASS_BY_CLASS = {
  'Ironclad Samurai': ['oath_iron_lord', 'oath_sutensai_blade', 'oath_undying_debt', 'oath_flesh_temple'],
  'Ronin':            ['ascendant_blade', 'iron_contract', 'returning_blade'],
  'Ashfoot':          ['skirmish_specialist', 'formation_anchor', 'salvage_innovator'],
  'Veilblade':        ['shadow_operative', 'signal_cutter', 'ghost_archive'],
  'Oni Hunter':       ['dissolution_specialist', 'afterlife_anchor', 'resonance_collector'],
  'Forge Tender':     ['resonance_keeper', 'black_smith', 'echomind_anchor'],
  'Wireweave':        ['combat_weave', 'wire_broker', 'iron_afterlife_weave', 'loom_maker'],
  'Chrome Shaper':    ['war_shaper', 'edge_builder', 'resonance_sculptor'],
  'Pulse Caller':     ['single_point', 'iron_suppressor', 'resonant_shot'],
  'Iron Monk':        ['orthodoxy', 'resonants', 'flesh_circle', 'path_of_the_between'],
  'Echo Speaker':     ['sutensai_aligned', 'deep_listener', 'herald'],
  'Void Walker':      ['ghost_operative', 'threshold_puller', 'anchor_keeper'],
  'Sutensai':         ['inquisitor', 'archive_master', 'priors_voice'],
  'Flesh Shaper':     ['the_mender', 'the_corruptor', 'the_self_shaper'],
  'Puppet Binder':    ['the_architect', 'the_possessor', 'the_network'],
  'Blood Smith':      ['the_weaponsmith', 'the_armorer', 'the_sculptor'],
  'The Hollow':       ['the_empty', 'the_shell'],
  'Shadow Daimyo':    ['spymaster', 'court_blade', 'broker'],
  'Voice of Debt':    ['oath_keeper', 'debt_collector', 'the_breaker'],
  'Merchant Knife':   ['supply_cutter', 'gilded_blade', 'kingmaker'],
  'Iron Herald':      ['warbanner', 'neutral_tongue', 'the_signal'],
  'Curse Eater':      ['purifier', 'conduit', 'the_consumed'],
  'Shell Dancer':     ['the_breaker', 'the_survivor', 'the_scavenger'],
  'Fracture Knight':  ['the_claimed', 'haunted_legion', 'the_anchor'],
  'The Unnamed':      ['convergent', 'divergent'],
};
// ─── Rules-accurate metadata (from system/00_core_rules.md & INDEX.md) ────

/** HP tier: FRAME*8 + base. Determines base HP and leveling curve flavor. */
const CLASS_HP_TIER = {
  'Ironclad Samurai': 'Martial', 'Ronin': 'Martial', 'Iron Herald': 'Martial', 'Blood Smith': 'Martial',
  'Iron Monk': 'Heavy', 'Fracture Knight': 'Heavy',
  'Ashfoot': 'Balanced', 'Veilblade': 'Balanced', 'Oni Hunter': 'Balanced',
  'Shell Dancer': 'Balanced', 'Curse Eater': 'Balanced', 'The Hollow': 'Balanced', 'Forge Tender': 'Balanced',
  'Wireweave': 'Technical', 'Chrome Shaper': 'Technical', 'Pulse Caller': 'Technical',
  'Sutensai': 'Technical', 'Echo Speaker': 'Technical', 'Void Walker': 'Technical', 'Flesh Shaper': 'Technical',
  'Shadow Daimyo': 'Social', 'Voice of Debt': 'Social', 'Merchant Knife': 'Social', 'Puppet Binder': 'Social',
  'The Unnamed': 'Unique',
};

/** HP base by tier (added to FRAME*8). Unique is handled specially at runtime. */
const HP_TIER_BASE = { Heavy: 20, Martial: 14, Balanced: 10, Technical: 6, Social: 6, Unique: 0 };

/** Class base hand size (rules: 5/6/7/8, max 12 with modifiers). */
const CLASS_HAND_BASE = {
  'Iron Monk': 5, 'Fracture Knight': 5, 'The Unnamed': 5,
  'Ironclad Samurai': 6, 'Ronin': 6, 'Blood Smith': 6, 'The Hollow': 6, 'Oni Hunter': 6, 'Iron Herald': 6,
  'Ashfoot': 7, 'Veilblade': 7, 'Shell Dancer': 7, 'Curse Eater': 7, 'Wireweave': 7, 'Chrome Shaper': 7,
  'Flesh Shaper': 7, 'Pulse Caller': 7, 'Sutensai': 7, 'Echo Speaker': 7, 'Void Walker': 7, 'Forge Tender': 7,
  'Shadow Daimyo': 8, 'Voice of Debt': 8, 'Merchant Knife': 8, 'Puppet Binder': 8,
};

/** Race stat bonuses (from races/*.md). "any" means player-chosen at creation. */
const RACE_STAT_BONUSES = {
  'Forged':        [{ stat: 'IRON', value: 1 }, { stat: 'any', value: 1 }],
  'Tethered':      [{ stat: 'RESONANCE', value: 1 }, { stat: 'FRAME', value: 1 }],
  'Echoed':        [{ stat: 'RESONANCE', value: 1 }, { stat: 'any', value: 1 }],
  'Wireborn':      [{ stat: 'SIGNAL', value: 1 }, { stat: 'EDGE', value: 1 }],
  'Stitched':      [{ stat: 'FRAME', value: 1 }, { stat: 'IRON', value: 1 }],
  'Shellbroken':   [{ stat: 'VEIL', value: 1 }, { stat: 'SIGNAL', value: 1 }],
  'Iron Blessed':  [{ stat: 'RESONANCE', value: 2 }],
  'Diminished':    [{ stat: 'VEIL', value: 1 }, { stat: 'EDGE', value: 1 }],
};

/** Race hand-size modifier. */
const RACE_HAND_MOD = {
  'Forged': 0, 'Tethered': 1, 'Echoed': 1, 'Wireborn': 1, 'Stitched': 0,
  'Shellbroken': 0, 'Iron Blessed': 0, 'Diminished': 2,
};

const CLASS_TO_PREFIX = {
  'Ironclad Samurai': 'ironclad', 'Ronin': 'ronin', 'Iron Monk': 'iron_monk',
  'Fracture Knight': 'fracture_knight', 'Ashfoot': 'ashfoot', 'Veilblade': 'veilblade',
  'Oni Hunter': 'oni_hunter', 'Shell Dancer': 'shell_dancer', 'Curse Eater': 'curse_eater',
  'The Hollow': 'hollow', 'Forge Tender': 'forge_tender', 'Wireweave': 'wireweave',
  'Chrome Shaper': 'chrome_shaper', 'Pulse Caller': 'pulse_caller', 'Sutensai': 'sutensai',
  'Flesh Shaper': 'flesh_shaper', 'Echo Speaker': 'echo_speaker', 'Void Walker': 'void_walker',
  'Blood Smith': 'blood_smith', 'Iron Herald': 'iron_herald', 'Shadow Daimyo': 'shadow_daimyo',
  'Voice of Debt': 'voice_of_debt', 'Merchant Knife': 'merchant_knife', 'Puppet Binder': 'puppet_binder',
  'The Unnamed': 'unnamed',
};

// Category → unlock level heuristic (tune as needed)
function unlockLevel(cat) {
  const c = String(cat || '').toLowerCase();
  if (c.includes('capstone')) return 20;
  if (c.includes('subclass_power')) return 9;
  if (c.includes('subclass')) return 3;
  if (c.includes('power')) return 5;
  if (c.includes('level_up')) return 2;
  return 1;
}

// Category → color hint for the UI
function categoryColor(cat) {
  const c = String(cat || '').toLowerCase();
  if (c.includes('capstone')) return 'capstone';
  if (c.includes('combat')) return 'combat';
  if (c.includes('defense')) return 'defense';
  if (c.includes('control')) return 'control';
  if (c.includes('mobility')) return 'mobility';
  if (c.includes('utility')) return 'utility';
  if (c.includes('passive')) return 'passive';
  if (c.includes('power')) return 'power';
  if (c.includes('reaction')) return 'reaction';
  if (c.includes('subclass')) return 'subclass';
  return 'misc';
}

// ─── Load raw TSVs ─────────────────────────────────────────────────────
const attrRows = parseTsv(path.join(SRC_TSV, 'attributes_READY.tsv'));
let actionRows = parseTsv(path.join(SRC_TSV, 'actions_READY.tsv'));
const itemRows = parseTsv(path.join(SRC_TSV, 'items_READY.tsv'));

// Overlay actions_STATTED.tsv (generated from class/race markdown). For any row
// with the same id, the statted version replaces the base row. New statted rows
// are appended.
const statPath = path.join(SRC_TSV, 'actions_STATTED.tsv');
if (fs.existsSync(statPath)) {
  const statted = parseTsv(statPath);
  const byId = new Map(actionRows.map((r) => [r.id, r]));
  for (const s of statted) byId.set(s.id, s);
  actionRows = Array.from(byId.values());
  console.log(`  overlaid ${statted.length} statted cards`);
}

// ─── Attributes ────────────────────────────────────────────────────────
const attributes = attrRows.map((r) => ({
  id: r.id,
  title: r.title || r.id,
  description: r.description || '',
  category: r.category || '',
  type: r.type || 'text',
  options: parseOptions(r.options),
  defaultValue: r.defaultValue || '',
  min: r.min === '' ? null : Number(r.min),
  max: r.max === '' ? null : Number(r.max),
}));

// Stat attributes are misaligned in source TSV; hardcode correct bounds.
const STAT_TITLES = ['IRON', 'EDGE', 'FRAME', 'SIGNAL', 'RESONANCE', 'VEIL'];
for (const a of attributes) {
  if (STAT_TITLES.includes(a.title)) {
    a.min = 1; a.max = 6; a.defaultValue = '1';
  }
  if (a.title === 'Points Spent') { a.min = 0; a.max = 12; a.defaultValue = '0'; }
  if (a.title === 'Level') { a.min = 1; a.max = 20; a.defaultValue = '1'; }
}

// Force Species + Class to be list dropdowns
const speciesAttr = attributes.find((a) => a.id === 'attr_species');
if (speciesAttr) { speciesAttr.type = 'list'; speciesAttr.options = SPECIES; speciesAttr.defaultValue = 'Forged'; }
const classAttr = attributes.find((a) => a.id === 'attr_class');
if (classAttr) { classAttr.type = 'list'; classAttr.options = CLASSES; classAttr.defaultValue = 'Ironclad Samurai'; }

// Humanize path options for subclass attributes
for (const a of attributes) {
  if (a.id.endsWith('_path') && a.options.length > 0 && a.options.every((o) => /^[a-z0-9_]+$/.test(o))) {
    a.options = a.options.map(humanize);
    if (a.defaultValue && /^[a-z0-9_]+$/.test(a.defaultValue)) a.defaultValue = humanize(a.defaultValue);
  }
}

// ─── Actions (cards) ───────────────────────────────────────────────────
function parseKeywordList(raw) {
  if (!raw) return [];
  return String(raw)
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^([A-Z][A-Za-z]+)(?:\s+(\d+))?$/);
      if (!m) return null;
      return { name: m[1], value: m[2] ? Number(m[2]) : null };
    })
    .filter(Boolean);
}

const actions = actionRows.map((r) => {
  let customProps = {};
  try { customProps = r.customProperties ? JSON.parse(r.customProperties) : {}; } catch { customProps = {}; }
  const statUnlock = customProps.unlockLevel ? Number(customProps.unlockLevel) : null;
  const level = statUnlock !== null ? statUnlock : unlockLevel(r.category);
  return {
    id: r.id,
    title: r.title || r.id,
    description: r.description || '',
    category: r.category || '',
    level,
    colorKey: categoryColor(r.category),
    apCost: Number(customProps.apCost ?? 0),
    isCard: customProps.isCard === 'true' || customProps.isCard === true,
    isBasicAttack: customProps.isBasicAttack === 'true' || customProps.isBasicAttack === true,
    playLimitPerTurn: customProps.playLimitPerTurn ? Number(customProps.playLimitPerTurn) : null,
    tier: customProps.tier !== undefined && customProps.tier !== '' ? Number(customProps.tier) : null,
    cardType: customProps.cardType || '',
    baseDamage: customProps.baseDamage !== undefined && customProps.baseDamage !== '' ? Number(customProps.baseDamage) : null,
    damageStat: customProps.damageStat || '',
    keywords: parseKeywordList(customProps.keywords),
    unlockLevel: statUnlock,
    startingHand: customProps.startingHand === 'true' || customProps.startingHand === true,
  };
});

// Group actions by class (uses `act_<prefix>_` OR `card_<prefix>_`)
const actionsByClass = {};
for (const [cls, prefix] of Object.entries(CLASS_TO_PREFIX)) {
  const a1 = `act_${prefix}_`, a2 = `card_${prefix}_`;
  actionsByClass[cls] = actions.filter((a) => a.id.startsWith(a1) || a.id.startsWith(a2)).map((a) => a.id);
}

// Subclass-specific action mapping (scan by humanized path slug inside action id)
const actionsBySubclass = {};
for (const [cls, rawList] of Object.entries(SUBCLASS_BY_CLASS)) {
  for (const slug of rawList) {
    const key = `${cls} — ${humanize(slug)}`;
    actionsBySubclass[key] = actions.filter((a) =>
      a.id.startsWith(`card_${slug}_`) ||
      a.id.startsWith(`act_${slug}_`) ||
      a.id.includes(`_${slug}_`)
    ).map((a) => a.id);
  }
}

// ─── Items ─────────────────────────────────────────────────────────────
const items = itemRows.map((r) => ({
  id: r.id,
  title: r.title || r.id,
  description: r.description || '',
  category: r.category || '',
  weight: Number(r.weight || 0),
  stackSize: Number(r.stackSize || 1),
  isContainer: r.isContainer === 'true',
  isEquippable: r.isEquippable === 'true',
  isConsumable: r.isConsumable === 'true',
}));

// ─── Class documents (markdown) ────────────────────────────────────────
const classDocs = {};
if (fs.existsSync(SRC_DOCS)) {
  for (const f of fs.readdirSync(SRC_DOCS)) {
    if (!f.endsWith('.md')) continue;
    const body = fs.readFileSync(path.join(SRC_DOCS, f), 'utf8');
    // First-line heading determines the class key
    const m = body.match(/^#\s+(.+?)\s*$/m);
    const title = m ? m[1].trim() : f.replace(/\.md$/, '');
    classDocs[title] = body;
  }
}

// ─── Subclass flavor text (from build_v2.js) ───────────────────────────
const SUBCLASS_FLAVOR = {
  'Ironclad Samurai — Oath Iron Lord': 'The steel-hearted general. Command presence, armor mastery, forged dominion.',
  'Ironclad Samurai — Oath Sutensai Blade': 'The void-touched blade. Resonant cuts that sever memory and selfhood.',
  'Ironclad Samurai — Oath Undying Debt': 'The debt-bound. Strength drawn from unfinished obligations.',
  'Ironclad Samurai — Oath Flesh Temple': 'The living shrine. Scarred body as sacred geometry.',
  'Ronin — Ascendant Blade': 'Discipline reforged outside any school. Precision through refusal.',
  'Ronin — Iron Contract': 'Hired steel. Contract-bound violence with its own ethics.',
  'Ronin — Returning Blade': 'The wanderer who returns. Blades that come back, debts that follow.',
  'Ashfoot — Skirmish Specialist': 'Hit-and-fade ashlands tactics. Mobility as a weapon.',
  'Ashfoot — Formation Anchor': 'Ashfoot rearguard. Holds ground when others break.',
  'Ashfoot — Salvage Innovator': 'Scavenger-engineer. Turns enemy wreckage into ally tools.',
  'Veilblade — Shadow Operative': 'The unseen knife. Works inside enemy ranks undetected.',
  'Veilblade — Signal Cutter': 'Severs comms. Isolates targets from their wire-support.',
  'Veilblade — Ghost Archive': 'The memory-thief. Steals and replays enemy intent.',
  'Oni Hunter — Dissolution Specialist': 'Unmakes unnatural things. Final-ender for the undying.',
  'Oni Hunter — Afterlife Anchor': 'Keeps the dead in place. Prevents re-manifestation.',
  'Oni Hunter — Resonance Collector': 'Harvests oni-essence as power reserves.',
  'Forge Tender — Resonance Keeper': 'Keeper of living forges. Heats metal with intent, not flame.',
  'Forge Tender — Black Smith': 'The smith of cursed things. Works metal that should not be worked.',
  'Forge Tender — Echomind Anchor': 'Binds forged items to a mind-imprint; they remember their maker.',
  'Wireweave — Combat Weave': 'Battle-grid weaver. Threads of iron signal in the air around you.',
  'Wireweave — Wire Broker': 'Mercenary of the wire-markets. Buys and sells signal access.',
  'Wireweave — Iron Afterlife Weave': 'Wire-dialog with the resonant dead.',
  'Wireweave — Loom Maker': 'Architect of mega-wire structures. Weaves entire zones.',
  'Chrome Shaper — War Shaper': 'Reshapes the body mid-combat. Living armor that adapts.',
  'Chrome Shaper — Edge Builder': 'Specialist in growing blade-extensions from flesh.',
  'Chrome Shaper — Resonance Sculptor': 'Carves resonant symbols directly into meat.',
  'Pulse Caller — Single Point': 'Focuses resonant energy to a killing pin-strike.',
  'Pulse Caller — Iron Suppressor': 'Damps enemy resonance. Turns off their augments.',
  'Pulse Caller — Resonant Shot': 'Fires pure resonance as a projectile.',
  'Iron Monk — Orthodoxy': 'Strict Iron Temple discipline. Traditional form-work.',
  'Iron Monk — Resonants': 'Heterodox monks. Resonance over ritual.',
  'Iron Monk — Flesh Circle': 'Body-integrated monks. Augmentation as devotion.',
  'Iron Monk — Path Of The Between': 'Walkers in the space between stances. Transitional mastery.',
  'Echo Speaker — Sutensai Aligned': 'Speaks for the void. Channels sutensai-origin voices.',
  'Echo Speaker — Deep Listener': 'Hears the iron-afterlife. Translates for the dead.',
  'Echo Speaker — Herald': 'Mouthpiece of power. Speaks things into being.',
  'Void Walker — Ghost Operative': 'Moves through voids. Crosses impossible gaps.',
  'Void Walker — Threshold Puller': 'Drags enemies into the in-between.',
  'Void Walker — Anchor Keeper': 'Stabilizes void-exposed allies.',
  'Sutensai — Inquisitor': 'Hunts apostates. Void-blessed interrogator.',
  'Sutensai — Archive Master': 'Keeper of forbidden sutensai knowledge.',
  'Sutensai — Priors Voice': 'Channels the first sutensai. Historic authority.',
  'Flesh Shaper — The Mender': 'Heals what should not be healed. Seals the un-seal-able.',
  'Flesh Shaper — The Corruptor': 'Twists flesh against itself. Terror as a medium.',
  'Flesh Shaper — The Self Shaper': 'Rewrites their own body. Ever-changing.',
  'Puppet Binder — The Architect': 'Designs puppet networks. Grand tactical control.',
  'Puppet Binder — The Possessor': 'Inhabits other bodies. Direct control.',
  'Puppet Binder — The Network': 'Many-mind collective. Puppet strings run both ways.',
  'Blood Smith — The Weaponsmith': 'Forges living weapons from blood and bone.',
  'Blood Smith — The Armorer': 'Grows armor from their own sacrificed flesh.',
  'Blood Smith — The Sculptor': 'Shapes blood into constructs and servants.',
  'The Hollow — The Empty': 'Pure absence. A void that walks.',
  'The Hollow — The Shell': 'Living shell with nothing inside. Mechanical autonomy.',
  'Shadow Daimyo — Spymaster': 'Runs the whisper network. Information as currency.',
  'Shadow Daimyo — Court Blade': 'Court-assassin and duelist. Etiquette-bound violence.',
  'Shadow Daimyo — Broker': 'Trade-power broker. Wields economic leverage.',
  'Voice of Debt — Oath Keeper': 'Enforces the debt-codes. Collects by any means.',
  'Voice of Debt — Debt Collector': 'Hunts debtors. Specialist in tracking and extraction.',
  'Voice of Debt — The Breaker': 'Breaks oaths weaponizing the fracture.',
  'Merchant Knife — Supply Cutter': 'Severs enemy logistics. Trade-war specialist.',
  'Merchant Knife — Gilded Blade': 'Wealthy-class assassin. Fashion meets violence.',
  'Merchant Knife — Kingmaker': 'Puts rulers on thrones for debts owed.',
  'Iron Herald — Warbanner': 'Battlefield rally-point. Makes allies braver.',
  'Iron Herald — Neutral Tongue': 'Diplomat-warrior. Ends wars through voice.',
  'Iron Herald — The Signal': 'Command-and-control. Orchestrates ally actions.',
  'Curse Eater — Purifier': 'Lifts curses cleanly. Saintly reputation.',
  'Curse Eater — Conduit': 'Channels curses through themselves as attacks.',
  'Curse Eater — The Consumed': 'Addicted to curses. Power at cost of self.',
  'Shell Dancer — The Breaker': 'Shatters enemy guard. Armor-cracker specialist.',
  'Shell Dancer — The Survivor': 'Endures where others break. Damage absorber.',
  'Shell Dancer — The Scavenger': 'Collects broken shells. Makes tools from failure.',
  'Fracture Knight — The Claimed': 'Resonance-fracture reclaimed; turned into strength.',
  'Fracture Knight — Haunted Legion': 'Carries the voices of fallen knights.',
  'Fracture Knight — The Anchor': 'Holds fracture open as a weapon.',
  'The Unnamed — Convergent': 'Traits that gather. Power growing toward one point.',
  'The Unnamed — Divergent': 'Traits that scatter. Multiplicity as strength.',
};

// Subclass path attribute title per class (e.g. "Ironclad Samurai" → "Vein Path")
const CLASS_TO_PATH_ATTR = {
  'Ironclad Samurai': 'Vein Path', 'Ronin': 'Ronin Path', 'Ashfoot': 'Ashfoot Path',
  'Veilblade': 'Veilblade Path', 'Oni Hunter': 'Oni Hunter Path', 'Forge Tender': 'Forge Tender Path',
  'Wireweave': 'Wireweave Path', 'Chrome Shaper': 'Chrome Shaper Path', 'Pulse Caller': 'Pulse Caller Path',
  'Iron Monk': 'Iron Monk Path', 'Echo Speaker': 'Echo Speaker Path', 'Void Walker': 'Void Walker Path',
  'Sutensai': 'Sutensai Path', 'Flesh Shaper': 'Flesh Shaper Path', 'Puppet Binder': 'Puppet Binder Path',
  'Blood Smith': 'Blood Smith Path', 'The Hollow': 'Hollow Path', 'Shadow Daimyo': 'Shadow Daimyo Path',
  'Voice of Debt': 'Voice of Debt Path', 'Merchant Knife': 'Merchant Knife Path',
  'Iron Herald': 'Iron Herald Path', 'Curse Eater': 'Curse Eater Path',
  'Shell Dancer': 'Shell Dancer Path', 'Fracture Knight': 'Fracture Knight Path', 'The Unnamed': 'Unnamed Path',
};

// Class flavor + primary stat synergy hints (used by creation wizard)
const CLASS_FLAVOR = {
  'Ironclad Samurai': 'Oath-bound blade of the Iron Temple. Philosopher-warrior whose resonance flows through honed steel and codified discipline.',
  'Ronin': 'Masterless blade. Discipline forged outside any school — precision, pragmatism, and a blade that always returns.',
  'Iron Monk': 'Living temple. Body and resonance as one; between-stance mastery and meditation-forged strikes.',
  'Fracture Knight': 'Rides the edges of resonance-fracture. Wields instability as a weapon; holds the broken places open.',
  'Ashfoot': 'Ashlands skirmisher. Hit-and-fade specialist; turns mobility and scavenged gear into unfair advantage.',
  'Veilblade': 'The blade nobody sees. Works inside enemy ranks — signal-cutting, memory-stealing, ghostlike.',
  'Oni Hunter': 'Specialist in the undying. Unmakes what should not be; final-ender of resonance horrors.',
  'Shell Dancer': 'Armor-cracker and scavenger. Breaks enemy guard; thrives on what others discard.',
  'Curse Eater': 'Consumes what should not be consumed. Absorbs debuffs from allies; channels curses as power.',
  'The Hollow': 'Empty by choice or catastrophe. A void that walks; mechanical autonomy and unnerving absence.',
  'Forge Tender': 'Keeper of living forges. Shapes metal with intent, not flame; black smith or echomind anchor.',
  'Wireweave': 'Signal architect. Weaves wire-threads of iron intent around the battlefield; broker or loom-maker.',
  'Chrome Shaper': 'Reshapes flesh as armor or blade in real time. Living biomods; the body as medium.',
  'Pulse Caller': 'Channels resonance into focused pulse-strikes. Ranged specialist; suppressor or sharpshooter.',
  'Sutensai': 'Void-touched scholar. Inquisitor, archivist, or voice of the first — orthodoxy-adjacent but dangerous.',
  'Flesh Shaper': 'Wound-worker. Mender, corruptor, or self-shaper — reshapes flesh as medium of violence or grace.',
  'Echo Speaker': 'Translator for the iron-afterlife. Channels resonant voices; herald, listener, or sutensai-aligned.',
  'Void Walker': 'Moves through impossible gaps. Crosses thresholds; drags enemies into the in-between.',
  'Blood Smith': 'Forges from blood and bone. Weaponsmith, armorer, or sculptor of living constructs.',
  'Iron Herald': 'Battlefield rally-point and diplomat. Makes allies braver; ends wars through voice.',
  'Shadow Daimyo': 'Court-assassin and spymaster. Etiquette-bound violence; information as currency.',
  'Voice of Debt': 'Enforces the debt-codes. Oath-keeper, debt-collector, or weaponized fracture.',
  'Merchant Knife': 'Trade-war specialist. Supply-cutter, gilded blade, or kingmaker with debts owed.',
  'Puppet Binder': 'Commands through strings. Architect of networks, direct possessor, or many-mind collective.',
  'The Unnamed': 'Traits that gather or scatter. Convergent or divergent — multiplicity as strength.',
};

const CLASS_PRIMARY_STATS = {
  'Ironclad Samurai': ['IRON', 'RESONANCE'],
  'Ronin': ['EDGE', 'IRON'],
  'Iron Monk': ['IRON', 'RESONANCE'],
  'Fracture Knight': ['FRAME', 'RESONANCE'],
  'Ashfoot': ['EDGE', 'FRAME'],
  'Veilblade': ['VEIL', 'EDGE'],
  'Oni Hunter': ['RESONANCE', 'EDGE'],
  'Shell Dancer': ['FRAME', 'IRON'],
  'Curse Eater': ['RESONANCE', 'FRAME'],
  'The Hollow': ['FRAME', 'VEIL'],
  'Forge Tender': ['SIGNAL', 'RESONANCE'],
  'Wireweave': ['SIGNAL', 'VEIL'],
  'Chrome Shaper': ['FRAME', 'IRON'],
  'Pulse Caller': ['RESONANCE', 'EDGE'],
  'Sutensai': ['RESONANCE', 'VEIL'],
  'Flesh Shaper': ['RESONANCE', 'SIGNAL'],
  'Echo Speaker': ['RESONANCE', 'VEIL'],
  'Void Walker': ['EDGE', 'RESONANCE'],
  'Blood Smith': ['RESONANCE', 'IRON'],
  'Iron Herald': ['VEIL', 'RESONANCE'],
  'Shadow Daimyo': ['VEIL', 'EDGE'],
  'Voice of Debt': ['VEIL', 'RESONANCE'],
  'Merchant Knife': ['VEIL', 'EDGE'],
  'Puppet Binder': ['SIGNAL', 'VEIL'],
  'The Unnamed': ['RESONANCE', 'FRAME'],
};

// Species descriptions (short flavor)
const SPECIES_FLAVOR = {
  'Forged': 'The default stock — flesh reshaped and bound by iron. Adaptable, unbroken, still in the making.',
  'Tethered': 'Biological purists. Few augments; strong kinship to organic memory and the old flesh.',
  'Echoed': 'Those who died and came back. Carry the iron-afterlife with them; awareness of the crossing.',
  'Wireborn': 'Born touched by ambient signal. Digital navigators; vulnerable to Silence effects.',
  'Stitched': 'Patchwork bodies. Multiple origins fused by necessity — each scar a history.',
  'Shellbroken': 'Survivors of catastrophic shell-failure. Broken and rebuilt; hollows with purpose.',
  'Iron Blessed': 'Touched by the Iron Temple. Sanctified metalwork; orthodoxy-adjacent.',
  'Diminished': 'Losses made permanent. Something was taken; what remains is sharper for it.',
};

// ─── Emit TS module ───────────────────────────────────────────────────
const out = [];
out.push('// GENERATED by scripts/build-data.mjs — do not edit by hand.');
out.push('// Regenerate with `npm run data`.');
out.push('');
out.push(`export const SPECIES = ${JSON.stringify(SPECIES, null, 2)} as const;`);
out.push(`export const CLASSES = ${JSON.stringify(CLASSES, null, 2)} as const;`);
out.push(`export const SUBCLASS_BY_CLASS: Record<string, string[]> = ${JSON.stringify(
  Object.fromEntries(Object.entries(SUBCLASS_BY_CLASS).map(([k, v]) => [k, v.map(humanize)])),
  null, 2
)};`);
out.push(`export const CLASS_TO_PATH_ATTR: Record<string, string> = ${JSON.stringify(CLASS_TO_PATH_ATTR, null, 2)};`);
out.push(`export const SPECIES_FLAVOR: Record<string, string> = ${JSON.stringify(SPECIES_FLAVOR, null, 2)};`);
out.push(`export const CLASS_FLAVOR: Record<string, string> = ${JSON.stringify(CLASS_FLAVOR, null, 2)};`);
out.push(`export const CLASS_PRIMARY_STATS: Record<string, string[]> = ${JSON.stringify(CLASS_PRIMARY_STATS, null, 2)};`);
out.push(`export const SUBCLASS_FLAVOR: Record<string, string> = ${JSON.stringify(SUBCLASS_FLAVOR, null, 2)};`);
out.push(`export type HpTier = 'Heavy' | 'Martial' | 'Balanced' | 'Technical' | 'Social' | 'Unique';`);
out.push(`export const CLASS_HP_TIER: Record<string, HpTier> = ${JSON.stringify(CLASS_HP_TIER, null, 2)};`);
out.push(`export const HP_TIER_BASE: Record<HpTier, number> = ${JSON.stringify(HP_TIER_BASE, null, 2)};`);
out.push(`export const CLASS_HAND_BASE: Record<string, number> = ${JSON.stringify(CLASS_HAND_BASE, null, 2)};`);
out.push(`export interface RaceStatBonus { stat: 'IRON' | 'EDGE' | 'FRAME' | 'SIGNAL' | 'RESONANCE' | 'VEIL' | 'any'; value: number; }`);
out.push(`export const RACE_STAT_BONUSES: Record<string, RaceStatBonus[]> = ${JSON.stringify(RACE_STAT_BONUSES, null, 2)};`);
out.push(`export const RACE_HAND_MOD: Record<string, number> = ${JSON.stringify(RACE_HAND_MOD, null, 2)};`);
out.push(`export const MAX_HAND_SIZE = 12;`);
out.push('');
out.push(`export interface Attribute {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'text' | 'string' | 'number' | 'boolean' | 'list' | string;
  options: string[];
  defaultValue: string;
  min: number | null;
  max: number | null;
}`);
out.push(`export const ATTRIBUTES: Attribute[] = ${JSON.stringify(attributes, null, 2)};`);
out.push('');
out.push(`export interface CardKeyword {
  name: string;
  value: number | null;
}`);
out.push(`export interface Action {
  id: string;
  title: string;
  description: string;
  category: string;
  level: number;
  colorKey: string;
  apCost: number;
  isCard: boolean;
  isBasicAttack: boolean;
  playLimitPerTurn: number | null;
  tier: number | null;
  cardType: string;
  baseDamage: number | null;
  damageStat: string;
  keywords: CardKeyword[];
  unlockLevel: number | null;
  startingHand: boolean;
}`);
out.push(`export const ACTIONS: Action[] = ${JSON.stringify(actions, null, 2)};`);
out.push(`export const ACTIONS_BY_CLASS: Record<string, string[]> = ${JSON.stringify(actionsByClass, null, 2)};`);
out.push(`export const ACTIONS_BY_SUBCLASS: Record<string, string[]> = ${JSON.stringify(actionsBySubclass, null, 2)};`);
out.push('');
out.push(`export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  weight: number;
  stackSize: number;
  isContainer: boolean;
  isEquippable: boolean;
  isConsumable: boolean;
}`);
out.push(`export const ITEMS: Item[] = ${JSON.stringify(items, null, 2)};`);
out.push('');
out.push(`export const CLASS_DOCS: Record<string, string> = ${JSON.stringify(classDocs, null, 2)};`);
out.push('');

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
console.log(`Wrote ${OUT}`);
console.log(`  ${attributes.length} attributes, ${actions.length} actions, ${items.length} items`);
console.log(`  ${Object.keys(classDocs).length} class docs`);
