// Tesshari v2 — Full ruleset rebuild using 5e template format as reference.
// Reads existing TSVs (attributes, actions, items) + archetypes, converts slug IDs to UUIDs,
// generates clean application data JSON + rebuild zip.
//
// Run: node build_v2.js
// Output: tesshari_v2/ folder + tesshari_0.4.0.zip

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const SRC = path.resolve(__dirname, 'questbound/import_tsv/aligned_for_qb');
const OLD_APP = path.resolve(__dirname, 'FullQuestboundReadyToZip/application data');
const BASE = path.resolve(__dirname, 'tesshari_v2');
const APP = path.join(BASE, 'application data');
const TS = '2026-04-17T12:00:00.000Z';

fs.rmSync(BASE, { recursive: true, force: true });
fs.mkdirSync(APP, { recursive: true });
['charts','scripts','documents','assets'].forEach(d => fs.mkdirSync(path.join(BASE, d), { recursive: true }));

function uuid() {
  const b = crypto.randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20,32)}`;
}
function writeJson(name, data) {
  fs.writeFileSync(path.join(APP, name), JSON.stringify(data, null, 2), 'utf8');
}
function writeTsv(name, headers, rows) {
  const lines = [headers.join('\t')];
  for (const r of rows) lines.push(headers.map(h => r[h] === undefined || r[h] === null ? '' : String(r[h])).join('\t'));
  fs.writeFileSync(path.join(BASE, name), lines.join('\n'), 'utf8');
}

// ─── TSV parser ────────────────────────────────────────────────────────
// Unescapes TSV-quoted cells: strips outer " and replaces "" → ".
function unescapeCell(s) {
  if (!s) return '';
  s = s.replace(/\r$/, '');
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1).replace(/""/g, '"');
  }
  return s;
}
function parseTsv(filePath) {
  const txt = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = txt.split(/\r?\n/).filter(l => l.length > 0);
  const headers = lines[0].split('\t').map(h => h.replace(/\r$/, ''));
  return lines.slice(1).map(line => {
    const cells = line.split('\t');
    const row = {};
    headers.forEach((h, i) => row[h] = unescapeCell(cells[i] ?? ''));
    return row;
  });
}

// Parse an options field that might be JSON array or pipe-separated.
function parseOptions(raw) {
  if (!raw || raw === '[]') return [];
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try { return JSON.parse(s); } catch { /* fall through */ }
  }
  if (s.includes('|')) return s.split('|').map(x => x.trim()).filter(Boolean);
  return [s];
}

// Serialize options to the 5e-format pipe-separated TSV cell.
function optionsToTsv(opts) {
  if (!Array.isArray(opts) || opts.length === 0) return '';
  return opts.join('|');
}

// ═══════════════════════════════════════════════════════════════════════
// LOAD SOURCE DATA
// ═══════════════════════════════════════════════════════════════════════
const srcAttrs = parseTsv(path.join(SRC, 'attributes_READY.tsv'));
const srcActions = parseTsv(path.join(SRC, 'actions_READY.tsv'));
const srcItems = parseTsv(path.join(SRC, 'items_READY.tsv'));

// Archetypes — use existing deduped archetypes.json from old build (42 unique)
const oldArchetypes = JSON.parse(fs.readFileSync(path.join(OLD_APP, 'archetypes.json'), 'utf8'));

console.log(`Loaded: ${srcAttrs.length} attributes, ${srcActions.length} actions, ${srcItems.length} items, ${oldArchetypes.length} archetypes`);

// ─── Slug → UUID mapping ───────────────────────────────────────────────
const slugToUuid = {};
function mapId(slug) {
  if (!slug) return null;
  if (!slugToUuid[slug]) slugToUuid[slug] = uuid();
  return slugToUuid[slug];
}

// ═══════════════════════════════════════════════════════════════════════
// IDs
// ═══════════════════════════════════════════════════════════════════════
const RULESET_ID = '4244b851-579a-4e85-b8e5-2932326df9ed';
const CHAR_ID    = uuid();
const INV_ID     = uuid();

const PAGES = {
  main:   { id: uuid(), label: 'Character' },
  combat: { id: uuid(), label: 'Combat' },
};

const WIN = {
  basics:     { id: uuid(), title: 'Character Basics' },
  stats:      { id: uuid(), title: 'Stats' },
  combat:     { id: uuid(), title: 'Combat' },
  identity:   { id: uuid(), title: 'Identity' },
  background: { id: uuid(), title: 'Background' },
  resources:  { id: uuid(), title: 'Class Resources' },
  subclass:   { id: uuid(), title: 'Subclass Paths' },
};

const CHAR_PAGE_IDS = Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, uuid()]));

// ═══════════════════════════════════════════════════════════════════════
// ATTRIBUTES — convert to new format with UUIDs
// ═══════════════════════════════════════════════════════════════════════
// Overrides: upgrade specific text/string attributes into list dropdowns with real options.
const SPECIES_OPTIONS = ['Forged','Tethered','Echoed','Wireborn','Stitched','Shellbroken','Iron Blessed','Diminished'];
const CLASS_OPTIONS = [
  'Ironclad Samurai','Ronin','Iron Monk','Fracture Knight','Ashfoot','Veilblade','Oni Hunter',
  'Shell Dancer','Curse Eater','The Hollow','Forge Tender','Wireweave','Chrome Shaper',
  'Pulse Caller','Sutensai','Flesh Shaper','Echo Speaker','Void Walker','Blood Smith',
  'Iron Herald','Shadow Daimyo','Voice of Debt','Merchant Knife','Puppet Binder','The Unnamed',
];
const STAT_BOUNDS = { type: 'number', defaultValue: '1', min: '1', max: '6', inventoryWidth: '', inventoryHeight: '' };
const OVERRIDES = {
  'attr_species': { type: 'list', optionsArr: SPECIES_OPTIONS, defaultValue: 'Forged' },
  'attr_class':   { type: 'list', optionsArr: CLASS_OPTIONS,   defaultValue: 'Ironclad Samurai' },
  // Source TSV is column-misaligned for stats (min empty, max=1, invW=6). Override.
  'attr_stat_iron':      STAT_BOUNDS,
  'attr_stat_edge':      STAT_BOUNDS,
  'attr_stat_frame':     STAT_BOUNDS,
  'attr_stat_signal':    STAT_BOUNDS,
  'attr_stat_resonance': STAT_BOUNDS,
  'attr_stat_veil':      STAT_BOUNDS,
  'attr_points_spent':   { type: 'number', defaultValue: '0', min: '0', max: '20', inventoryWidth: '', inventoryHeight: '' },
};

// ─── Combined subclass selection ───────────────────────────────────────
// One dropdown with every subclass option across every class, prefixed
// with the class name so the user knows which class it belongs to.
// The character loader parses the selected string and routes to the
// matching per-class Path attribute init function.
// Map: option label → { attr, raw }
const SUBCLASS_BY_CLASS = {
  'Ironclad Samurai': { attr: 'Vein Path',             raw: ['oath_iron_lord','oath_sutensai_blade','oath_undying_debt','oath_flesh_temple'] },
  'Ronin':            { attr: 'Ronin Path',            raw: ['ascendant_blade','iron_contract','returning_blade'] },
  'Ashfoot':          { attr: 'Ashfoot Path',          raw: ['skirmish_specialist','formation_anchor','salvage_innovator'] },
  'Veilblade':        { attr: 'Veilblade Path',        raw: ['shadow_operative','signal_cutter','ghost_archive'] },
  'Oni Hunter':       { attr: 'Oni Hunter Path',       raw: ['dissolution_specialist','afterlife_anchor','resonance_collector'] },
  'Forge Tender':     { attr: 'Forge Tender Path',     raw: ['resonance_keeper','black_smith','echomind_anchor'] },
  'Wireweave':        { attr: 'Wireweave Path',        raw: ['combat_weave','wire_broker','iron_afterlife_weave','loom_maker'] },
  'Chrome Shaper':    { attr: 'Chrome Shaper Path',    raw: ['war_shaper','edge_builder','resonance_sculptor'] },
  'Pulse Caller':     { attr: 'Pulse Caller Path',     raw: ['single_point','iron_suppressor','resonant_shot'] },
  'Iron Monk':        { attr: 'Iron Monk Path',        raw: ['orthodoxy','resonants','flesh_circle','path_of_the_between'] },
  'Echo Speaker':     { attr: 'Echo Speaker Path',     raw: ['sutensai_aligned','deep_listener','herald'] },
  'Void Walker':      { attr: 'Void Walker Path',      raw: ['ghost_operative','threshold_puller','anchor_keeper'] },
  'Sutensai':         { attr: 'Sutensai Path',         raw: ['inquisitor','archive_master','priors_voice'] },
  'Flesh Shaper':     { attr: 'Flesh Shaper Path',     raw: ['the_mender','the_corruptor','the_self_shaper'] },
  'Puppet Binder':    { attr: 'Puppet Binder Path',    raw: ['the_architect','the_possessor','the_network'] },
  'Blood Smith':      { attr: 'Blood Smith Path',      raw: ['the_weaponsmith','the_armorer','the_sculptor'] },
  'The Hollow':       { attr: 'Hollow Path',           raw: ['the_empty','the_shell'] },
  'Shadow Daimyo':    { attr: 'Shadow Daimyo Path',    raw: ['spymaster','court_blade','broker'] },
  'Voice of Debt':    { attr: 'Voice of Debt Path',    raw: ['oath_keeper','debt_collector','the_breaker'] },
  'Merchant Knife':   { attr: 'Merchant Knife Path',   raw: ['supply_cutter','gilded_blade','kingmaker'] },
  'Iron Herald':      { attr: 'Iron Herald Path',      raw: ['warbanner','neutral_tongue','the_signal'] },
  'Curse Eater':      { attr: 'Curse Eater Path',      raw: ['purifier','conduit','the_consumed'] },
  'Shell Dancer':     { attr: 'Shell Dancer Path',     raw: ['the_breaker','the_survivor','the_scavenger'] },
  'Fracture Knight':  { attr: 'Fracture Knight Path',  raw: ['the_claimed','haunted_legion','the_anchor'] },
  'The Unnamed':      { attr: 'Unnamed Path',          raw: ['convergent','divergent'] },
};
function humanize(slug) {
  return slug.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
const COMBINED_SUBCLASS_OPTIONS = [];
for (const [cls, { raw }] of Object.entries(SUBCLASS_BY_CLASS)) {
  for (const r of raw) COMBINED_SUBCLASS_OPTIONS.push(`${cls} — ${humanize(r)}`);
}

// ─── Class → action slug prefix (for grouping actions into class rosters) ─
const CLASS_TO_PREFIX = {
  'Ironclad Samurai':'ironclad', 'Ronin':'ronin', 'Iron Monk':'iron_monk',
  'Fracture Knight':'fracture_knight', 'Ashfoot':'ashfoot', 'Veilblade':'veilblade',
  'Oni Hunter':'oni_hunter', 'Shell Dancer':'shell_dancer', 'Curse Eater':'curse_eater',
  'The Hollow':'hollow', 'Forge Tender':'forge_tender', 'Wireweave':'wireweave',
  'Chrome Shaper':'chrome_shaper', 'Pulse Caller':'pulse_caller', 'Sutensai':'sutensai',
  'Flesh Shaper':'flesh_shaper', 'Echo Speaker':'echo_speaker', 'Void Walker':'void_walker',
  'Blood Smith':'blood_smith', 'Iron Herald':'iron_herald', 'Shadow Daimyo':'shadow_daimyo',
  'Voice of Debt':'voice_of_debt', 'Merchant Knife':'merchant_knife', 'Puppet Binder':'puppet_binder',
  'The Unnamed':'unnamed',
};

const attributes = srcAttrs.map(r => {
  const newId = mapId(r.id);
  let optsArr = parseOptions(r.options);
  let type = r.type || 'text';
  let defaultValue = r.defaultValue || '';
  let min = r.min || '', max = r.max || '';
  let invW = r.inventoryWidth || '', invH = r.inventoryHeight || '';
  const ov = OVERRIDES[r.id];
  if (ov) {
    if (ov.type !== undefined) type = ov.type;
    if (ov.optionsArr) optsArr = ov.optionsArr;
    if (ov.defaultValue !== undefined) defaultValue = ov.defaultValue;
    if (ov.min !== undefined) min = ov.min;
    if (ov.max !== undefined) max = ov.max;
    if (ov.inventoryWidth !== undefined) invW = ov.inventoryWidth;
    if (ov.inventoryHeight !== undefined) invH = ov.inventoryHeight;
  }
  // Humanize raw slug options for subclass Path attributes (e.g.
  // "oath_iron_lord" → "Oath Iron Lord") so the dropdown is readable.
  if (r.id.endsWith('_path') && optsArr.length > 0 && optsArr.every(o => /^[a-z0-9_]+$/.test(o))) {
    optsArr = optsArr.map(o => o.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
    if (defaultValue && /^[a-z0-9_]+$/.test(defaultValue)) {
      defaultValue = defaultValue.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return {
    slug: r.id, id: newId,
    title: r.title || r.id, description: r.description || '',
    category: r.category || '', type,
    optionsArr: optsArr,
    options: optionsToTsv(optsArr), // pipe-separated for TSV output
    defaultValue,
    optionsChartRef: r.optionsChartRef || '', optionsChartColumnHeader: r.optionsChartColumnHeader || '',
    min, max,
    inventoryWidth: invW, inventoryHeight: invH,
    image: r.image || '', customProperties: r.customProperties || '',
  };
});

// Helper to find attribute UUID by TITLE (for sheet building)
const attrByTitle = {};
attributes.forEach(a => { attrByTitle[a.title] = a.id; });

// ═══════════════════════════════════════════════════════════════════════
// CHARACTER ATTRIBUTE INSTANCES
// ═══════════════════════════════════════════════════════════════════════
function coerceDefault(type, raw) {
  if (type === 'boolean') return raw === 'true' || raw === true;
  if (type === 'number') { const n = Number(raw); return Number.isFinite(n) ? n : 0; }
  return raw ?? '';
}

const characterAttributes = attributes.map(a => {
  const base = {
    title: a.title, description: a.description, category: a.category,
    type: a.type, options: a.optionsArr,
    defaultValue: coerceDefault(a.type, a.defaultValue),
    image: null,
    rulesetId: RULESET_ID,
    value: coerceDefault(a.type, a.defaultValue),
    attributeCustomPropertyValues: {},
    id: uuid(),
    characterId: CHAR_ID,
    attributeId: a.id,
    assetId: null,
    createdAt: TS, updatedAt: TS,
  };
  if (a.type === 'number') {
    if (a.min !== '' && a.min !== null && a.min !== undefined) base.min = Number(a.min);
    if (a.max !== '' && a.max !== null && a.max !== undefined) base.max = Number(a.max);
  }
  return base;
});

// ═══════════════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════════════
const actions = srcActions.map(r => ({
  slug: r.id, id: mapId(r.id),
  title: r.title || r.id, description: r.description || '',
  category: r.category || '',
  inventoryHeight: r.inventoryHeight || '1', inventoryWidth: r.inventoryWidth || '1',
  image: r.image || '', customProperties: r.customProperties || '',
}));

// ─── Group actions by class prefix → used for abilities text + documents ─
// Actions are keyed by `act_<prefix>_` OR `card_<prefix>_` depending on era.
const classActions = {}; // { className: [ {title, description, category} ] }
for (const [cls, prefix] of Object.entries(CLASS_TO_PREFIX)) {
  const a1 = `act_${prefix}_`, a2 = `card_${prefix}_`;
  classActions[cls] = actions.filter(a => a.slug.startsWith(a1) || a.slug.startsWith(a2))
    .map(a => ({ title: a.title, description: a.description, category: a.category, slug: a.slug }));
}
// Subclass actions: match actions whose slug contains the humanized path
// slug. Many subclass cards are prefixed `card_<path_slug>_*` or have the
// path slug in the middle; we scan broadly.
const subclassActions = {}; // { 'Class — Path': [actions] }
for (const [cls, info] of Object.entries(SUBCLASS_BY_CLASS)) {
  for (const pathSlug of info.raw) {
    const combo = `${cls} — ${humanize(pathSlug)}`;
    // Common match patterns: card_<pathSlug>_*, act_<pathSlug>_*, anything containing _<pathSlug>
    const needle = pathSlug;
    subclassActions[combo] = actions
      .filter(a => a.slug.startsWith(`card_${needle}_`) ||
                   a.slug.startsWith(`act_${needle}_`) ||
                   a.slug.includes(`_${needle}_`))
      .map(a => ({ title: a.title, description: a.description, category: a.category, slug: a.slug }));
  }
}

// Subclass flavor text — brief description per option. Falls back to the
// path name if no ability actions are tagged.
const SUBCLASS_FLAVOR = {
  'Ironclad Samurai — Oath Iron Lord':       'The steel-hearted general. Command presence, armor mastery, forged dominion.',
  'Ironclad Samurai — Oath Sutensai Blade':  'The void-touched blade. Resonant cuts that sever memory and selfhood.',
  'Ironclad Samurai — Oath Undying Debt':    'The debt-bound. Strength drawn from unfinished obligations.',
  'Ironclad Samurai — Oath Flesh Temple':    'The living shrine. Scarred body as sacred geometry.',
  'Ronin — Ascendant Blade':                 'Discipline reforged outside any school. Precision through refusal.',
  'Ronin — Iron Contract':                   'Hired steel. Contract-bound violence with its own ethics.',
  'Ronin — Returning Blade':                 'The wanderer who returns. Blades that come back, debts that follow.',
  'Ashfoot — Skirmish Specialist':           'Hit-and-fade ashlands tactics. Mobility as a weapon.',
  'Ashfoot — Formation Anchor':              'Ashfoot rearguard. Holds ground when others break.',
  'Ashfoot — Salvage Innovator':             'Scavenger-engineer. Turns enemy wreckage into ally tools.',
  'Veilblade — Shadow Operative':            'The unseen knife. Works inside enemy ranks undetected.',
  'Veilblade — Signal Cutter':               'Severs comms. Isolates targets from their wire-support.',
  'Veilblade — Ghost Archive':               'The memory-thief. Steals and replays enemy intent.',
  'Oni Hunter — Dissolution Specialist':     'Unmakes unnatural things. Final-ender for the undying.',
  'Oni Hunter — Afterlife Anchor':           'Keeps the dead in place. Prevents re-manifestation.',
  'Oni Hunter — Resonance Collector':        'Harvests oni-essence as power reserves.',
  'Forge Tender — Resonance Keeper':         'Keeper of living forges. Heats metal with intent, not flame.',
  'Forge Tender — Black Smith':              'The smith of cursed things. Works metal that should not be worked.',
  'Forge Tender — Echomind Anchor':          'Binds forged items to a mind-imprint; they remember their maker.',
  'Wireweave — Combat Weave':                'Battle-grid weaver. Threads of iron signal in the air around you.',
  'Wireweave — Wire Broker':                 'Mercenary of the wire-markets. Buys and sells signal access.',
  'Wireweave — Iron Afterlife Weave':        'Wire-dialog with the resonant dead.',
  'Wireweave — Loom Maker':                  'Architect of mega-wire structures. Weaves entire zones.',
  'Chrome Shaper — War Shaper':              'Reshapes the body mid-combat. Living armor that adapts.',
  'Chrome Shaper — Edge Builder':            'Specialist in growing blade-extensions from flesh.',
  'Chrome Shaper — Resonance Sculptor':      'Carves resonant symbols directly into meat.',
  'Pulse Caller — Single Point':             'Focuses resonant energy to a killing pin-strike.',
  'Pulse Caller — Iron Suppressor':          'Damps enemy resonance. Turns off their augments.',
  'Pulse Caller — Resonant Shot':            'Fires pure resonance as a projectile.',
  'Iron Monk — Orthodoxy':                   'Strict Iron Temple discipline. Traditional form-work.',
  'Iron Monk — Resonants':                   'Heterodox monks. Resonance over ritual.',
  'Iron Monk — Flesh Circle':                'Body-integrated monks. Augmentation as devotion.',
  'Iron Monk — Path Of The Between':         'Walkers in the space between stances. Transitional mastery.',
  'Echo Speaker — Sutensai Aligned':         'Speaks for the void. Channels sutensai-origin voices.',
  'Echo Speaker — Deep Listener':            'Hears the iron-afterlife. Translates for the dead.',
  'Echo Speaker — Herald':                   'Mouthpiece of power. Speaks things into being.',
  'Void Walker — Ghost Operative':           'Moves through voids. Crosses impossible gaps.',
  'Void Walker — Threshold Puller':          'Drags enemies into the in-between.',
  'Void Walker — Anchor Keeper':             'Stabilizes void-exposed allies.',
  'Sutensai — Inquisitor':                   'Hunts apostates. Void-blessed interrogator.',
  'Sutensai — Archive Master':               'Keeper of forbidden sutensai knowledge.',
  'Sutensai — Priors Voice':                 'Channels the first sutensai. Historic authority.',
  'Flesh Shaper — The Mender':               'Heals what should not be healed. Seals the un-seal-able.',
  'Flesh Shaper — The Corruptor':            'Twists flesh against itself. Terror as a medium.',
  'Flesh Shaper — The Self Shaper':          'Rewrites their own body. Ever-changing.',
  'Puppet Binder — The Architect':           'Designs puppet networks. Grand tactical control.',
  'Puppet Binder — The Possessor':           'Inhabits other bodies. Direct control.',
  'Puppet Binder — The Network':             'Many-mind collective. Puppet strings run both ways.',
  'Blood Smith — The Weaponsmith':           'Forges living weapons from blood and bone.',
  'Blood Smith — The Armorer':               'Grows armor from their own sacrificed flesh.',
  'Blood Smith — The Sculptor':              'Shapes blood into constructs and servants.',
  'The Hollow — The Empty':                  'Pure absence. A void that walks.',
  'The Hollow — The Shell':                  'Living shell with nothing inside. Mechanical autonomy.',
  'Shadow Daimyo — Spymaster':               'Runs the whisper network. Information as currency.',
  'Shadow Daimyo — Court Blade':             'Court-assassin and duelist. Etiquette-bound violence.',
  'Shadow Daimyo — Broker':                  'Trade-power broker. Wields economic leverage.',
  'Voice of Debt — Oath Keeper':             'Enforces the debt-codes. Collects by any means.',
  'Voice of Debt — Debt Collector':          'Hunts debtors. Specialist in tracking and extraction.',
  'Voice of Debt — The Breaker':             'Breaks oaths weaponizing the fracture.',
  'Merchant Knife — Supply Cutter':          'Severs enemy logistics. Trade-war specialist.',
  'Merchant Knife — Gilded Blade':           'Wealthy-class assassin. Fashion meets violence.',
  'Merchant Knife — Kingmaker':              'Puts rulers on thrones for debts owed.',
  'Iron Herald — Warbanner':                 'Battlefield rally-point. Makes allies braver.',
  'Iron Herald — Neutral Tongue':            'Diplomat-warrior. Ends wars through voice.',
  'Iron Herald — The Signal':                'Command-and-control. Orchestrates ally actions.',
  'Curse Eater — Purifier':                  'Lifts curses cleanly. Saintly reputation.',
  'Curse Eater — Conduit':                   'Channels curses through themselves as attacks.',
  'Curse Eater — The Consumed':              'Addicted to curses. Power at cost of self.',
  'Shell Dancer — The Breaker':              'Shatters enemy guard. Armor-cracker specialist.',
  'Shell Dancer — The Survivor':             'Endures where others break. Damage absorber.',
  'Shell Dancer — The Scavenger':            'Collects broken shells. Makes tools from failure.',
  'Fracture Knight — The Claimed':           'Resonance-fracture reclaimed; turned into strength.',
  'Fracture Knight — Haunted Legion':        'Carries the voices of fallen knights.',
  'Fracture Knight — The Anchor':            'Holds fracture open as a weapon.',
  'The Unnamed — Convergent':                'Traits that gather. Power growing toward one point.',
  'The Unnamed — Divergent':                 'Traits that scatter. Multiplicity as strength.',
};

// Helper: escape a single-line string for safe embedding in QBScript single
// quotes. Replaces backslash, newlines, and apostrophes.
function qbEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
}

// Category → unlock level. Simple heuristic; tune per-class later if needed.
function unlockLevel(cat) {
  const c = (cat || '').toLowerCase();
  if (c.includes('capstone')) return 20;
  if (c.includes('subclass_power')) return 9;
  if (c.includes('subclass')) return 3;
  if (c.includes('power')) return 5;
  if (c.includes('level_up')) return 2;
  // Everything else (combat/defense/utility/passive/reaction/mobility/control
  // /core/card) unlocks at level 1.
  return 1;
}

// Build per-class abilities summary string (one line per action).
function classAbilitiesText(cls) {
  const rows = classActions[cls] || [];
  if (rows.length === 0) return `${cls}: (no actions defined yet)`;
  const lines = [`${cls} — ${rows.length} abilities:`];
  for (const a of rows) {
    const desc = a.description ? ` — ${a.description}` : '';
    lines.push(`• ${a.title}${desc}`);
  }
  return lines.join('\n');
}

function subclassAbilitiesText(combo) {
  const rows = subclassActions[combo] || [];
  const flavor = SUBCLASS_FLAVOR[combo] || '';
  const pieces = [];
  if (flavor) pieces.push(flavor);
  if (rows.length > 0) {
    pieces.push(`Subclass-tagged abilities (${rows.length}):`);
    for (const a of rows) {
      pieces.push(`${a.title}${a.description ? ': ' + a.description : ''}`);
    }
  } else {
    pieces.push('Subclass shares its class ability roster. See the Class Abilities panel for the full list; see the class document for full subclass mechanics.');
  }
  return pieces.join(' · ');
}

// ═══════════════════════════════════════════════════════════════════════
// ITEMS
// ═══════════════════════════════════════════════════════════════════════
const items = srcItems.map(r => ({
  slug: r.id, id: mapId(r.id),
  title: r.title || r.id, description: r.description || '',
  category: r.category || '',
  weight: r.weight || '0', defaultQuantity: r.defaultQuantity || '1', stackSize: r.stackSize || '1',
  isContainer: r.isContainer || 'false', isStorable: r.isStorable || 'true',
  isEquippable: r.isEquippable || 'false', isConsumable: r.isConsumable || 'false',
  inventoryWidth: r.inventoryWidth || '1', inventoryHeight: r.inventoryHeight || '1',
  image: r.image || '', actionIds: r.actionIds || '', customProperties: r.customProperties || '',
}));

// ═══════════════════════════════════════════════════════════════════════
// ARCHETYPES — 5e pattern: archetype = character TEMPLATE.
// One player archetype + one monster archetype (with variantOptions).
// Race/Class/Subclass are attribute dropdowns on the sheet, not archetypes.
// ═══════════════════════════════════════════════════════════════════════
const PLAYER_ARCHETYPE_ID = uuid();
const MONSTER_ARCHETYPE_ID = uuid();
// Monster's testCharacter is separate from the PC's test character (like 5e does).
// Keeping null for now since we don't generate a distinct monster test character;
// QB appears to still list the archetype as selectable.
const archetypes = [
  {
    slug: 'arc_player_character',
    id: PLAYER_ARCHETYPE_ID,
    rulesetId: RULESET_ID,
    name: 'Player Character',
    description: 'A Tesshari player character. Choose Race, Class, and Subclass on the sheet — the loader applies all mechanical effects automatically.',
    assetId: null,
    image: null,
    testCharacterId: CHAR_ID,
    isDefault: false,
    loadOrder: 1,
    mapHeight: 1, mapWidth: 1,
    createdAt: TS, updatedAt: TS,
  },
  {
    slug: 'arc_monster',
    id: MONSTER_ARCHETYPE_ID,
    rulesetId: RULESET_ID,
    name: 'Monster',
    description: 'An NPC opponent. Pick a variant for the tier/role profile.',
    assetId: null,
    image: null,
    testCharacterId: null,
    isDefault: false,
    loadOrder: 2,
    mapHeight: 1, mapWidth: 1,
    variantOptions: ['Minion / Skirmisher','Minion / Brute','Standard / Skirmisher','Standard / Brute','Standard / Controller','Standard / Support','Elite / Skirmisher','Elite / Brute','Elite / Controller','Elite / Support','Boss / Brute','Boss / Controller'],
    createdAt: TS, updatedAt: TS,
  },
];

// ═══════════════════════════════════════════════════════════════════════
// SCRIPTS — extract existing on_add_X functions from qbscript_pack,
// auto-generate minimal on_add() for archetypes without explicit scripts.
// ═══════════════════════════════════════════════════════════════════════
const SCRIPT_SRC = path.resolve(__dirname, 'questbound/qbscript_pack');

// Parse a .qbs file and extract top-level named functions as { name: body }
// Trailing comment/blank lines before the next function are excluded.
function extractFunctions(qbsPath) {
  const text = fs.readFileSync(qbsPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  const fns = {};
  let currentName = null;
  let currentBody = [];
  const finish = () => {
    if (!currentName) return;
    // Strip trailing blank lines and top-level comment lines.
    while (currentBody.length > 0) {
      const last = currentBody[currentBody.length - 1];
      if (/^\s*$/.test(last) || /^\/\//.test(last)) currentBody.pop();
      else break;
    }
    fns[currentName] = currentBody.join('\n') + '\n';
  };
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*[^)]*\)\s*:\s*$/);
    if (m && !line.startsWith(' ') && !line.startsWith('\t')) {
      finish();
      currentName = m[1];
      currentBody = [line];
    } else if (currentName) {
      currentBody.push(line);
    }
  }
  finish();
  return fns;
}

const raceFns = extractFunctions(path.join(SCRIPT_SRC, '03_race_scripts.qbs'));
const classFns1 = extractFunctions(path.join(SCRIPT_SRC, '04_class_scripts_2_to_13.qbs'));
const classFns2 = extractFunctions(path.join(SCRIPT_SRC, '05_class_scripts_14_to_25.qbs'));
const allFns = { ...raceFns, ...classFns1, ...classFns2 };
console.log(`Parsed functions: race=${Object.keys(raceFns).length}, class1=${Object.keys(classFns1).length}, class2=${Object.keys(classFns2).length}`);

// Strip the function header line (on_add_X(): or on_add():) to get just the body
function stripHeader(body) {
  const lines = body.split('\n');
  const idx = lines.findIndex(l => /^[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(l));
  return idx >= 0 ? lines.slice(idx + 1).join('\n') : body;
}

// Races: display name (matches list option) → source function name
const RACE_DISPATCH = {
  'Tethered':       'on_add_tethered',
  'Echoed':         'on_add_echoed',
  'Wireborn':       'on_add_wireborn',
  'Stitched':       'on_add_stitched',
  'Shellbroken':    'on_add_shellbroken',
  'Iron Blessed':   'on_add_iron_blessed',
  'Diminished':     'on_add_diminished',
  // Forged has no source function — generated inline
};

// Classes: display name → source function
const CLASS_DISPATCH = {
  'Ronin':             'on_add_ronin',
  'Ashfoot':           'on_add_ashfoot',
  'Veilblade':         'on_add_veilblade',
  'Oni Hunter':        'on_add_oni_hunter',
  'Forge Tender':      'on_add_forge_tender',
  'Wireweave':         'on_add_wireweave',
  'Chrome Shaper':     'on_add_chrome_shaper',
  'Pulse Caller':      'on_add_pulse_caller',
  'Iron Monk':         'on_add_iron_monk',
  'Echo Speaker':      'on_add_echo_speaker',
  'Void Walker':       'on_add_void_walker',
  'Sutensai':          'on_add_sutensai',
  'Flesh Shaper':      'on_add_flesh_shaper',
  'Puppet Binder':     'on_add_puppet_binder',
  'Blood Smith':       'on_add_blood_smith',
  'The Hollow':        'on_add_hollow',
  'Shadow Daimyo':     'on_add_shadow_daimyo',
  'Voice of Debt':     'on_add_voice_of_debt',
  'Merchant Knife':    'on_add_merchant_knife',
  'Iron Herald':       'on_add_iron_herald',
  'Curse Eater':       'on_add_curse_eater',
  'Shell Dancer':      'on_add_shell_dancer',
  'Fracture Knight':   'on_add_fracture_knight',
  'The Unnamed':       'on_add_unnamed',
  // Ironclad Samurai has no source function — generated inline
};

// Build script records + write .qbs files
const scriptsDir = path.join(BASE, 'scripts');
fs.mkdirSync(path.join(scriptsDir, 'global'), { recursive: true });

const scriptMeta = [];

// Global helper script — minimal version containing ONLY the helpers the
// character loader needs. The full card-economy section (runCard, validateCardPlay,
// markCardPlayed, etc.) was triggering a parse/runtime issue where QB reported
// "Undefined variable 'actionKey'" from the loader. Those helpers can be added
// back once they're attached to action scripts that actually need them.
// 4-space indent required by QBScript (2-space will fail: "expected multiple of 4 spaces")
const globalSrc = [
  '// Tesshari global helpers — minimal set required by the character loader.',
  '// QBScript has no `null` literal; use `!var` truthy checks.',
  '',
  'getAttrText(name, fallback):',
  '    a = Owner.Attribute(name)',
  '    if !a:',
  '        return fallback',
  '    v = a.value',
  '    if !v:',
  '        return fallback',
  '    return text(v)',
  '',
  'getAttrNumber(name, fallback):',
  '    a = Owner.Attribute(name)',
  '    if !a:',
  '        return fallback',
  '    v = a.value',
  '    if !v:',
  '        return fallback',
  '    return number(v)',
  '',
  'setAttr(name, value):',
  '    a = Owner.Attribute(name)',
  '    if a:',
  '        a.set(value)',
  '',
].join('\n');
fs.writeFileSync(path.join(scriptsDir, 'global', 'tesshari_card_core.qbs'), globalSrc, 'utf8');
scriptMeta.push({
  id: uuid(),
  name: 'tesshari_card_core',
  file: 'scripts/global/tesshari_card_core.qbs',
  entityType: 'global',
  entityId: null,
  entityName: 'Tesshari Card Core',
  isGlobal: true,
  enabled: true,
  category: 'Global',
});

// ═══════════════════════════════════════════════════════════════════════
// CHARACTER LOADER — dispatches on ATTRIBUTE VALUES (Species, Class, Vein Path, etc.)
// Runs whenever the character sheet loads. Setting a dropdown value then
// re-opening the sheet applies the corresponding init.
// ═══════════════════════════════════════════════════════════════════════
const loaderDir = path.join(scriptsDir, 'character_loaders');
fs.rmSync(loaderDir, { recursive: true, force: true });
fs.mkdirSync(loaderDir, { recursive: true });

// Helper: convert a display name → a safe identifier for function names
const ident = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// Normalize leading indentation to multiples of 4 spaces (QBScript requirement).
// Source scripts use 2-space indents; this doubles each level.
function normalizeIndent(body) {
  return body.split('\n').map(line => {
    if (line.length === 0) return line;
    const m = line.match(/^( +)/);
    if (!m) return line;
    const spaces = m[1].length;
    // Count effective levels assuming 2-space source, convert to 4-space.
    const levels = Math.floor(spaces / 2);
    return '    '.repeat(levels) + line.slice(spaces);
  }).join('\n');
}

function makeInitFn(fnNameSuffix, body) {
  // Indent each non-empty body line with exactly 4 spaces at its base level.
  const normalized = normalizeIndent(body);
  const inner = normalized.split('\n').map(l => {
    if (l.length === 0) return l;
    if (/^ /.test(l)) return l; // already indented
    return '    ' + l;
  }).join('\n');
  return `init_${fnNameSuffix}():\n${inner}`;
}

// 4-space-indented fallbacks
function fallbackRace(name) {
  const esc = name.replace(/'/g, "\\'");
  return `    setAttr('Species', '${esc}')\n    Owner.setProperty('race_tag', '${ident(name)}')\n    announce('${esc} race initialized.')\n    return`;
}
function fallbackClass(name) {
  const esc = name.replace(/'/g, "\\'");
  return `    Owner.Attribute('Class').set('${esc}')\n    Owner.setProperty('class_tag', '${ident(name)}')\n    announce('${esc} class initialized.')\n    return`;
}
function fallbackSubclass(attrTitle, option) {
  return `    setAttr('${attrTitle}', '${option}')\n    announce('${attrTitle}: ${option} applied.')\n    return`;
}

// Minimal character loader — matches the 5e pattern. The loader does NOT
// dispatch per-class logic. Class features exist as attributes on every
// character; players toggle them as they level up. The loader just
// stamps the archetype's name into 'Class' as a fallback so new
// characters have a starting class value (and imports Monster variants).
const loaderLines = [
  '// Tesshari character loader — runs on character load / sheet-open.',
  '// Follows the 5e pattern: no per-class init, no level-gating.',
  '// Players manage class features (attributes) themselves.',
  '',
  'init_monster(character):',
  '    variant = character.variant',
  '    if !variant:',
  '        return',
  "    announce('Monster variant: ' + variant)",
  '',
  "if Owner.hasArchetype('Monster'):",
  '    init_monster(Owner)',
  '',
];

const loaderPath = path.join(loaderDir, 'tesshari_loader.qbs');
fs.writeFileSync(loaderPath, loaderLines.join('\n'), 'utf8');

scriptMeta.push({
  id: uuid(),
  name: 'tesshari_loader',
  file: 'scripts/character_loaders/tesshari_loader.qbs',
  entityType: 'characterLoader',
  entityId: null,
  entityName: 'Tesshari Character Loader',
  isGlobal: false,
  enabled: true,
  category: 'Character',
});

console.log(`Character loader: minimal 5e-style (no per-class dispatch).`);
console.log(`Script metadata entries: ${scriptMeta.length} (global + characterLoader)`);

// ═══════════════════════════════════════════════════════════════════════
// WINDOWS
// ═══════════════════════════════════════════════════════════════════════
const windows = Object.values(WIN).map(w => ({
  title: w.title, description: '', category: '', hideFromPlayerView: false,
  id: w.id, rulesetId: RULESET_ID,
  createdAt: TS, updatedAt: TS,
}));

// ═══════════════════════════════════════════════════════════════════════
// STYLE PRESETS
// ═══════════════════════════════════════════════════════════════════════
const sText = (size=14, color='#FAF7F2', align='center', weight='normal') => JSON.stringify({
  color, backgroundColor: 'transparent', opacity: 1,
  borderRadiusTopLeft: 0, borderRadiusTopRight: 0, borderRadiusBottomLeft: 0, borderRadiusBottomRight: 0,
  outlineWidth: 0, outlineColor: '', outline: 'solid',
  fontSize: size, fontWeight: weight, fontStyle: 'normal', fontFamily: 'Roboto Condensed',
  textDecoration: 'none', textAlign: align, verticalAlign: 'center',
  paddingTop: 0, paddingBottom: 0, paddingLeft: 4, paddingRight: 4,
});
// Editable input style. Solid opaque dark background + light text.
// When rendered as a <select> dropdown, open options will inherit these colors
// instead of falling back to browser default white-on-white.
const sInput = (size=18) => JSON.stringify({
  backgroundColor: '#1e1e3a', opacity: 1,
  borderRadiusTopLeft: 4, borderRadiusTopRight: 4, borderRadiusBottomLeft: 4, borderRadiusBottomRight: 4,
  outlineWidth: 1, outlineColor: '#555588', outline: 'solid',
  fontSize: size, fontWeight: 'bold', fontStyle: 'normal', fontFamily: 'Roboto Condensed',
  textDecoration: 'none', textAlign: 'center', verticalAlign: 'center',
  color: '#FAF7F2',
  paddingTop: 0, paddingBottom: 0, paddingLeft: 4, paddingRight: 4,
});
// Dropdown style — dark text on white background so options stay readable
// in the browser-default dropdown popup.
const sDropdown = (size=14) => JSON.stringify({
  backgroundColor: '#ffffff', opacity: 1,
  borderRadiusTopLeft: 4, borderRadiusTopRight: 4, borderRadiusBottomLeft: 4, borderRadiusBottomRight: 4,
  outlineWidth: 1, outlineColor: '#555588', outline: 'solid',
  fontSize: size, fontWeight: 'normal', fontStyle: 'normal', fontFamily: 'Roboto Condensed',
  textDecoration: 'none', textAlign: 'start', verticalAlign: 'center',
  color: '#1a1a2e',
  paddingTop: 0, paddingBottom: 0, paddingLeft: 6, paddingRight: 6,
});
const sShape = (bg='#1a1a2e', r=6) => JSON.stringify({
  backgroundColor: bg, opacity: 1,
  borderRadiusTopLeft: r, borderRadiusTopRight: r, borderRadiusBottomLeft: r, borderRadiusBottomRight: r,
  outlineWidth: 0, outlineColor: '', outline: 'solid',
  paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
});

// Lookup: attribute UUID → attribute definition. Used by input() to pick style.
const attrById = {};
attributes.forEach(a => { attrById[a.id] = a; });

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
const components = [];

function comp(winId, type, x, y, w, h, data, style, extras={}) {
  return {
    z: extras.z ?? 1, type, x, y, width: w, height: h, rotation: 0,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    style, selected: false,
    id: uuid(), rulesetId: RULESET_ID, windowId: winId,
    parentComponentId: null, groupId: null,
    attributeId: extras.attributeId ?? null,
    actionId: extras.actionId ?? null,
    scriptId: extras.scriptId ?? null,
    childWindowId: extras.childWindowId ?? null,
    createdAt: TS, updatedAt: TS,
  };
}

const txt = (winId, x, y, w, h, value, style) => comp(winId, 'text', x, y, w, h, { value }, style || sText());

function input(winId, x, y, w, h, attrId, type='number', placeholder='') {
  const attr = attrById[attrId];
  const isList = attr && attr.type === 'list';
  const style = isList ? sDropdown(14) : sInput(type==='text' ? 14 : 18);
  return comp(winId, 'comp-input', x, y, w, h, { placeholder, type }, style, { attributeId: attrId, z: 2 });
}
const shape = (winId, x, y, w, h, bg, r) => comp(winId, 'shape', x, y, w, h, { sides: 4 }, sShape(bg, r), { z: 0 });

// Toggle checkbox: outlined box + conditional fill + label
function addChk(winId, x, y, w, h, attrId, label) {
  const bgY = y + Math.floor((h - 20) / 2);
  components.push(comp(winId, 'shape', x, bgY, 20, 20,
    { sides: 4, toggleBooleanAttributeId: attrId },
    sShape('#111136', 3), { z: 1, attributeId: attrId }));
  components.push(comp(winId, 'shape', x+4, bgY+4, 12, 12,
    { sides: 4, conditionalRenderAttributeId: attrId, toggleBooleanAttributeId: attrId },
    sShape('#8888c8', 2), { z: 2, attributeId: attrId }));
  components.push(txt(winId, x+26, y, w-26, h, label, sText(13, '#b0b0d0', 'start')));
}

function addHeader(winId, x, y, w, label) {
  components.push(shape(winId, x, y, w, 34, '#3b3b7a', 6));
  components.push(txt(winId, x, y, w, 34, label, sText(16, '#ffe08a', 'center', 'bold')));
}

// Attribute binding helper — returns UUID for an attr title, or null
function a(title) {
  const id = attrByTitle[title];
  if (!id) console.warn('Missing attribute:', title);
  return id;
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: CHARACTER BASICS (600×220)
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.basics.id;
  components.push(shape(W, 0, 0, 600, 220, '#0d0d22'));
  addHeader(W, 0, 0, 600, 'CHARACTER BASICS');

  // Row 1: Species | Class
  components.push(txt(W, 10, 42, 80, 28, 'Species', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 90, 42, 200, 28, a('Species'), 'text', 'Species'));
  components.push(txt(W, 300, 42, 60, 28, 'Class', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 360, 42, 230, 28, a('Class'), 'text', 'Class'));

  // Row 2: Level | Heritage
  components.push(txt(W, 10, 78, 80, 28, 'Level', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 90, 78, 80, 28, a('Level'), 'number', '1'));
  components.push(txt(W, 180, 78, 80, 28, 'Heritage', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 260, 78, 330, 28, a('Forged Heritage'), 'text', 'Heritage'));

  // HP row
  components.push(txt(W, 10, 120, 80, 40, 'HP', sText(15, '#e0ca60', 'start', 'bold')));
  components.push(input(W, 90, 120, 120, 40, a('Current HP'), 'number', '0'));
  components.push(txt(W, 210, 120, 20, 40, '/', sText(20, '#888', 'center')));
  components.push(input(W, 230, 120, 120, 40, a('Max HP'), 'number', '0'));

  // AP row
  components.push(txt(W, 10, 170, 80, 40, 'AP', sText(15, '#5b9dff', 'start', 'bold')));
  components.push(input(W, 90, 170, 120, 40, a('AP Current'), 'number', '3'));
  components.push(txt(W, 210, 170, 20, 40, '/', sText(20, '#888', 'center')));
  components.push(input(W, 230, 170, 120, 40, a('AP Max'), 'number', '3'));

  // Guard
  components.push(txt(W, 370, 120, 80, 40, 'Guard', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 450, 120, 140, 40, a('Guard Value'), 'number', '0'));
  // Shield
  components.push(txt(W, 370, 170, 80, 40, 'Shield', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 450, 170, 140, 40, a('Shield Temp HP'), 'number', '0'));
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: STATS (320×280)
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.stats.id;
  components.push(shape(W, 0, 0, 320, 280, '#0d0d22'));
  addHeader(W, 0, 0, 320, 'STATS');
  const rows = [
    ['IRON',      'melee · force'],
    ['EDGE',      'initiative · precision'],
    ['FRAME',     'HP · endurance'],
    ['SIGNAL',    'wire craft · hacking'],
    ['RESONANCE', 'spiritual · healing'],
    ['VEIL',      'social · concealment'],
  ];
  rows.forEach(([title, note], i) => {
    const y = 44 + i * 34;
    components.push(txt(W, 10, y, 90, 30, title, sText(14, '#FAF7F2', 'start', 'bold')));
    components.push(input(W, 100, y, 60, 30, a(title), 'number', '1'));
    components.push(txt(W, 170, y, 140, 30, note, sText(11, '#8888b0', 'start')));
  });
  // Points Spent
  components.push(txt(W, 10, 250, 160, 22, 'Points Spent (of 20)', sText(12, '#a0a0c0', 'start')));
  components.push(input(W, 180, 250, 60, 22, a('Points Spent'), 'number', '0'));
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: COMBAT (320×320)
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.combat.id;
  components.push(shape(W, 0, 0, 320, 320, '#0d0d22'));
  addHeader(W, 0, 0, 320, 'COMBAT TRACKER');

  // Turn state toggles
  addChk(W, 10, 44, 300, 24, a('Active Turn'), 'Active Turn');
  addChk(W, 10, 72, 300, 24, a('Basic Attack Used This Turn'), 'Basic Attack Used');
  addChk(W, 10, 100, 300, 24, a('Card Play Locked'), 'Card Play Locked');

  // Status values
  components.push(txt(W, 10, 140, 120, 26, 'Exposed', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 140, 140, 80, 26, a('Exposed Value'), 'number', '0'));

  addChk(W, 10, 174, 300, 24, a('Staggered'), 'Staggered');
  addChk(W, 10, 202, 300, 24, a('Marked Target'), 'Marked Target');

  components.push(txt(W, 10, 236, 120, 26, 'Overheat', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 140, 236, 80, 26, a('Overheat Stacks'), 'number', '0'));

  components.push(txt(W, 10, 270, 120, 26, 'Turn #', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 140, 270, 80, 26, a('Turn Number'), 'number', '0'));
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: IDENTITY (380×320)
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.identity.id;
  components.push(shape(W, 0, 0, 380, 320, '#0d0d22'));
  addHeader(W, 0, 0, 380, 'IDENTITY & PATH');

  let y = 44;
  const rows = [
    ['Vein Oath',             'Vein Oath'],
    ['Vein Path',             'Vein Path'],
    ['Vein Discipline L1',    'Discipline 1'],
    ['Vein Discipline L2',    'Discipline 2'],
    ['Augmentation Slot 1',   'Aug Slot 1'],
    ['Augmentation Slot 2',   'Aug Slot 2'],
    ['Maintenance State',     'Maintenance'],
  ];
  rows.forEach(([attrTitle, label]) => {
    components.push(txt(W, 10, y, 120, 30, label, sText(13, '#a0a0c0', 'start')));
    components.push(input(W, 135, y, 235, 30, a(attrTitle), 'text', ''));
    y += 34;
  });

  // Resonance Fracture toggle
  addChk(W, 10, y, 360, 24, a('Resonance Fracture'), 'Resonance Fracture');
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: BACKGROUND (320×290)
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.background.id;
  components.push(shape(W, 0, 0, 320, 290, '#0d0d22'));
  addHeader(W, 0, 0, 320, 'BACKGROUND');

  const rows = [
    ['Reach',         'Reach'],
    ['Caste',         'Caste'],
    ['Faction Ties',  'Faction'],
  ];
  rows.forEach(([attrTitle, label], i) => {
    const y = 44 + i * 36;
    components.push(txt(W, 10, y, 80, 30, label, sText(13, '#a0a0c0', 'start')));
    components.push(input(W, 95, y, 215, 30, a(attrTitle), 'text', ''));
  });

  // Debt / Need
  components.push(txt(W, 10, 160, 300, 22, 'Who do you owe?', sText(13, '#b0b0d0', 'start', 'bold')));
  components.push(input(W, 10, 184, 300, 46, a('Who I Owe'), 'text', 'A lord · a debt · a contract'));

  components.push(txt(W, 10, 234, 300, 22, 'What do you need?', sText(13, '#b0b0d0', 'start', 'bold')));
  components.push(input(W, 10, 258, 300, 26, a('What I Need'), 'text', 'What drives you into danger'));
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: SUBCLASS PATHS — 5e pattern: all class path attributes exist as
// dropdowns on every character; player uses the one matching their Class.
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.subclass.id;
  const classAttrId = attrByTitle['Class'];
  const CLS_ROWS = [
    'Ironclad Samurai','Ronin','Ashfoot','Veilblade','Oni Hunter',
    'Forge Tender','Wireweave','Chrome Shaper','Pulse Caller','Iron Monk',
    'Echo Speaker','Void Walker','Sutensai','Flesh Shaper','Puppet Binder',
    'Blood Smith','The Hollow','Shadow Daimyo','Voice of Debt','Merchant Knife',
    'Iron Herald','Curse Eater','Shell Dancer','Fracture Knight','The Unnamed',
  ];
  const rowH = 34;
  const winW = 460;
  const winH = 48 + CLS_ROWS.length * rowH + 16;

  components.push(shape(W, 0, 0, winW, winH, '#0d0d22'));
  addHeader(W, 0, 0, winW, 'SUBCLASS PATHS');

  CLS_ROWS.forEach((cls, i) => {
    const info = SUBCLASS_BY_CLASS[cls];
    if (!info) return;
    const aid = attrByTitle[info.attr];
    if (!aid) return;
    const y = 48 + i * rowH;

    // Highlight the matching row (shape conditional render = works natively)
    components.push(comp(W, 'shape', 4, y - 2, winW - 8, rowH,
      { sides: 4, conditionalRenderAttributeId: classAttrId,
        conditionalRenderLogic: { operator: 'equals', value: cls } },
      sShape('#2a2a55', 4),
      { z: 0 }));

    components.push(txt(W, 10, y, 160, rowH - 4, cls,
      sText(13, '#a0a0c0', 'start')));
    components.push(input(W, 175, y, winW - 185, rowH - 4, aid, 'text', 'Choose path'));
  });
}

// ───────────────────────────────────────────────────────────────────────
// WINDOW: CLASS RESOURCES (380×380) — most-used class counters
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.resources.id;
  components.push(shape(W, 0, 0, 380, 380, '#0d0d22'));
  addHeader(W, 0, 0, 380, 'CLASS RESOURCES');

  const rows = [
    // title  | label
    ['Resonant Surge Uses',     'Resonant Surge'],
    ['Grief Stacks',            'Grief Stacks'],
    ['Cascade Count',           'Cascade'],
    ['Phantom Charges',         'Phantom Charges'],
    ['Fracture Stacks',         'Fracture Stacks'],
    ['Binding Threads',         'Binding Threads'],
    ['Loaded Count',            'Loaded'],
    ['Corruption',              'Corruption'],
    ['Intelligence',            'Intelligence'],
    ['Contacts',                'Contacts'],
  ];
  rows.forEach(([attrTitle, label], i) => {
    const y = 44 + i * 32;
    const aid = attrByTitle[attrTitle];
    if (!aid) return;
    components.push(txt(W, 10, y, 200, 28, label, sText(13, '#a0a0c0', 'start')));
    components.push(input(W, 220, y, 140, 28, aid, 'number', '0'));
  });
}


// ═══════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════
const pages = Object.entries(PAGES).map(([k, p]) => ({
  label: p.label, hideFromPlayerView: false,
  rulesetId: RULESET_ID, id: p.id,
  createdAt: TS, updatedAt: TS,
}));

// ═══════════════════════════════════════════════════════════════════════
// RULESET WINDOWS — place windows on pages
// ═══════════════════════════════════════════════════════════════════════
const rulesetWindows = [
  // CHARACTER page: basics + stats + subclass + identity + background
  { winKey: 'basics',     pageKey: 'main', x: 20,  y: 20 },
  { winKey: 'stats',      pageKey: 'main', x: 20,  y: 260 },
  { winKey: 'subclass',   pageKey: 'main', x: 360, y: 260 },
  { winKey: 'identity',   pageKey: 'main', x: 840, y: 260 },
  { winKey: 'background', pageKey: 'main', x: 20,  y: 1220 },
  // COMBAT page: combat + class resources
  { winKey: 'combat',     pageKey: 'combat', x: 20,  y: 20 },
  { winKey: 'resources',  pageKey: 'combat', x: 360, y: 20 },
].map(rw => ({
  id: uuid(),
  rulesetId: RULESET_ID,
  windowId: WIN[rw.winKey].id,
  title: WIN[rw.winKey].title,
  rulesetPageId: PAGES[rw.pageKey].id,
  x: rw.x, y: rw.y,
  isCollapsed: false,
  createdAt: TS, updatedAt: TS,
}));

// ═══════════════════════════════════════════════════════════════════════
// CHARACTER PAGES + WINDOWS (clone of ruleset setup for the test character)
// ═══════════════════════════════════════════════════════════════════════
const characterPages = Object.entries(PAGES).map(([k, p]) => ({
  label: p.label, hideFromPlayerView: false,
  rulesetId: RULESET_ID, pageId: p.id,
  id: CHAR_PAGE_IDS[k], characterId: CHAR_ID,
  createdAt: TS, updatedAt: TS,
}));

const characterWindows = rulesetWindows.map(rw => {
  // Find which pageKey this rw belongs to
  const pageKey = Object.entries(PAGES).find(([k, v]) => v.id === rw.rulesetPageId)[0];
  return {
    title: rw.title, x: rw.x, y: rw.y, isCollapsed: false,
    id: uuid(), characterId: CHAR_ID,
    characterPageId: CHAR_PAGE_IDS[pageKey],
    windowId: rw.windowId,
    createdAt: TS, updatedAt: TS,
  };
});

// ═══════════════════════════════════════════════════════════════════════
// CHARACTERS + INVENTORY
// ═══════════════════════════════════════════════════════════════════════
const characters = [{
  userId: 'User_c8a35c12',
  name: 'Test Character',
  assetId: null, image: null,
  isTestCharacter: true,
  componentData: {},
  lastViewedPageId: CHAR_PAGE_IDS.main,
  sheetLocked: false,
  customProperties: {},
  lastSyncedAt: TS,
  id: CHAR_ID, rulesetId: RULESET_ID, inventoryId: INV_ID,
  pinnedSidebarDocuments: [], pinnedSidebarCharts: [],
  createdAt: TS, updatedAt: TS,
}];

const inventories = [{
  rulesetId: RULESET_ID, title: "Test Character's Inventory",
  category: null, type: null, entities: [], items: [],
  id: INV_ID, characterId: CHAR_ID,
  createdAt: TS, updatedAt: TS,
}];

// ═══════════════════════════════════════════════════════════════════════
// DOCUMENTS — one markdown doc per class + overview index.
// ═══════════════════════════════════════════════════════════════════════
const documents = [];
{
  const docsDir = path.join(BASE, 'documents');
  fs.mkdirSync(docsDir, { recursive: true });

  const docFileSlug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  for (const cls of CLASS_OPTIONS) {
    const docId = uuid();
    const slug = docFileSlug(cls);
    const filename = `${slug}_${docId}.md`;
    const rows = classActions[cls] || [];
    const info = SUBCLASS_BY_CLASS[cls] || { raw: [] };

    const lines = [];
    lines.push(`# ${cls}`);
    lines.push('');
    lines.push(`*Tesshari class reference.*`);
    lines.push('');
    lines.push(`## Overview`);
    lines.push('');
    lines.push(`The ${cls} is one of 25 core classes in Tesshari. Each class has a roster of cards (abilities) played during combat using the AP economy. Subclass paths unlock class-specific specializations.`);
    lines.push('');
    lines.push(`## Subclass Paths`);
    lines.push('');
    if (info.raw.length === 0) {
      lines.push('- *(no paths defined yet)*');
    } else {
      for (const r of info.raw) lines.push(`- **${humanize(r)}**`);
    }
    lines.push('');
    lines.push(`## Abilities (${rows.length})`);
    lines.push('');
    if (rows.length === 0) {
      lines.push('*(ability list pending — see master actions reference)*');
    } else {
      const byCat = {};
      for (const a of rows) {
        const c = a.category || 'misc';
        (byCat[c] ||= []).push(a);
      }
      for (const [cat, group] of Object.entries(byCat)) {
        lines.push(`### ${cat}`);
        lines.push('');
        for (const a of group) {
          lines.push(`- **${a.title}** — ${a.description || '(no description)'}`);
        }
        lines.push('');
      }
    }
    lines.push(`---`);
    lines.push(`Generated ${TS} for Tesshari ruleset.`);

    fs.writeFileSync(path.join(docsDir, filename), lines.join('\n'), 'utf8');
    documents.push({
      title: cls, id: docId, rulesetId: RULESET_ID,
      assetId: null, pdfAssetId: null, filename,
      createdAt: TS, updatedAt: TS,
    });
  }

  // Overview index document
  const docId = uuid();
  const filename = `tesshari_overview_${docId}.md`;
  const overviewLines = [
    '# Tesshari — Ruleset Overview',
    '',
    '*A card-based TTRPG of Iron, Resonance, and Debt.*',
    '',
    '## Core Loop',
    '',
    '- Every turn you spend **AP** (Action Points) to play ability cards.',
    '- Basic Attack is free (no AP) once per turn.',
    '- Most cards cost 1–3 AP.',
    '- Subclass and capstone cards unlock at higher levels.',
    '',
    '## Species',
    '',
    ...SPECIES_OPTIONS.map(s => `- **${s}**`),
    '',
    '## Classes',
    '',
    ...CLASS_OPTIONS.map(c => `- **${c}** — ${(classActions[c] || []).length} abilities`),
    '',
    '---',
    `Generated ${TS} for Tesshari ruleset.`,
  ];
  fs.writeFileSync(path.join(docsDir, filename), overviewLines.join('\n'), 'utf8');
  documents.push({
    title: 'Tesshari Overview', id: docId, rulesetId: RULESET_ID,
    assetId: null, pdfAssetId: null, filename,
    createdAt: TS, updatedAt: TS,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════════
const metadata = {
  ruleset: {
    id: RULESET_ID,
    title: 'Tesshari',
    description: 'Card-based AP TTRPG — Forged race, Ironclad Samurai class + 23 other classes.',
    details: {}, assetId: null,
    version: '0.4.0', palette: [],
    createdBy: 'User_c8a35c12',
    createdAt: TS, updatedAt: TS,
    characterCtaTitle: 'Characters',
    characterCtaDescription: 'Create and Manage Characters for this Ruleset',
    campaignsCtaTitle: 'Campaigns',
    campaignCtaDescription: 'Create and Launch a Campaign for this Ruleset',
    isModule: false,
    charactersCtaAssetId: null, campaignsCtaAssetId: null,
    image: null,
  },
  exportInfo: { exportedAt: TS, exportedBy: 'Quest Bound', version: '2.0.0' },
  counts: {
    attributes: attributes.length, actions: actions.length, items: items.length,
    charts: 0, windows: windows.length, components: components.length,
    composites: 0, compositeVariants: 0, assets: 0, fonts: 0, documents: documents.length,
    archetypes: archetypes.length,
    customProperties: 0, archetypeCustomProperties: 0, itemCustomProperties: 0,
    characterAttributes: characterAttributes.length,
    inventories: inventories.length,
    characterWindows: characterWindows.length,
    characterPages: characterPages.length,
    rulesetWindows: rulesetWindows.length,
    pages: pages.length, inventoryItems: 0,
    scripts: scriptMeta.length, campaigns: 0, campaignScenes: 0, campaignCharacters: 0,
    campaignEvents: 0, sceneTurnCallbacks: 0,
  },
  scripts: scriptMeta,
};

// ═══════════════════════════════════════════════════════════════════════
// WRITE TSVs
// ═══════════════════════════════════════════════════════════════════════
writeTsv('attributes.tsv',
  ['id','title','description','category','type','options','defaultValue','optionsChartRef','optionsChartColumnHeader','min','max','inventoryWidth','inventoryHeight','image','customProperties','assetFilename'],
  attributes.map(a => ({ ...a, assetFilename: '' })));

writeTsv('actions.tsv',
  ['id','title','description','category','inventoryHeight','inventoryWidth','image','customProperties','assetFilename'],
  actions.map(a => ({ ...a, assetFilename: '' })));

writeTsv('items.tsv',
  ['id','title','description','category','weight','defaultQuantity','stackSize','isContainer','isStorable','isEquippable','isConsumable','inventoryWidth','inventoryHeight','image','actionIds','assetFilename'],
  items.map(i => ({ ...i, assetFilename: '' })));

// ═══════════════════════════════════════════════════════════════════════
// WRITE JSON
// ═══════════════════════════════════════════════════════════════════════
writeJson('metadata.json', metadata);
writeJson('characters.json', characters);
writeJson('inventories.json', inventories);
writeJson('inventoryItems.json', []);
writeJson('characterAttributes.json', characterAttributes);
writeJson('archetypes.json', archetypes);
writeJson('windows.json', windows);
writeJson('components.json', components);
writeJson('pages.json', pages);
writeJson('rulesetWindows.json', rulesetWindows);
writeJson('characterPages.json', characterPages);
writeJson('characterWindows.json', characterWindows);
writeJson('charts.json', []);
writeJson('documents.json', documents);
writeJson('assets.json', []);

// README
fs.writeFileSync(path.join(BASE, 'README.md'),
`# Tesshari Ruleset Export (v0.4.0)

Rebuilt using the D&D 5e System Module format as reference.

## Counts
- Attributes: ${attributes.length}
- Actions: ${actions.length}
- Items: ${items.length}
- Archetypes: ${archetypes.length}
- Windows: ${windows.length}
- Pages: ${pages.length}
- Components: ${components.length}

## Import
Delete existing Tesshari ruleset in QB, then import this zip.
`, 'utf8');

console.log('=== Generated ===');
console.log('  Attributes:', attributes.length);
console.log('  Actions:   ', actions.length);
console.log('  Items:     ', items.length);
console.log('  Archetypes:', archetypes.length);
console.log('  Windows:   ', windows.length);
console.log('  Pages:     ', pages.length);
console.log('  Components:', components.length);
console.log('  Char attrs:', characterAttributes.length);

// ═══════════════════════════════════════════════════════════════════════
// BUILD ZIP (contents at root) — delegated to build_v2_zip.ps1
// ═══════════════════════════════════════════════════════════════════════
const dest = path.resolve(__dirname, 'tesshari_0.4.0.zip');
const script = path.resolve(__dirname, 'build_v2_zip.ps1');
execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${script}" -Base "${BASE}" -Dest "${dest}"`, { stdio: 'inherit' });
const size = fs.statSync(dest).size;
console.log(`Zip size: ${(size/1024).toFixed(1)} KB`);
