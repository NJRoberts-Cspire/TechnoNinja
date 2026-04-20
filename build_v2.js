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
  main:     { id: uuid(), label: 'Character' },
  combat:   { id: uuid(), label: 'Combat' },
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

// Append the synthetic combined Subclass Selection attribute (76 options,
// each prefixed by class name so the user can scan to their class).
attributes.push({
  slug: 'attr_subclass_selection',
  id: mapId('attr_subclass_selection'),
  title: 'Subclass Selection',
  description: 'Pick the subclass path matching your selected Class. The character loader applies the mechanical effects.',
  category: 'subclass',
  type: 'list',
  optionsArr: COMBINED_SUBCLASS_OPTIONS,
  options: optionsToTsv(COMBINED_SUBCLASS_OPTIONS),
  defaultValue: '',
  optionsChartRef: '', optionsChartColumnHeader: '',
  min: '', max: '',
  inventoryWidth: '', inventoryHeight: '',
  image: '', customProperties: '',
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
  '',
  'getAttrText(name, fallback):',
  '    a = Owner.Attribute(name)',
  '    if !a:',
  '        return fallback',
  '    v = a.value',
  '    if v == null:',
  '        return fallback',
  '    return text(v)',
  '',
  'getAttrNumber(name, fallback):',
  '    a = Owner.Attribute(name)',
  '    if !a:',
  '        return fallback',
  '    v = a.value',
  '    if v == null:',
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

const loaderLines = [];
loaderLines.push('// Tesshari character loader — runs on character load/sheet-open.');
loaderLines.push('// Dispatches race/class/subclass logic by reading attribute values.');
loaderLines.push('// Requires: tesshari_card_core global helpers (setAttr, announce, etc.)');
loaderLines.push('');

// Race init functions
loaderLines.push('// ══ RACE INITS ══');
for (const [name, fnName] of Object.entries(RACE_DISPATCH)) {
  const id = ident(name);
  const src = allFns[fnName];
  const body = src ? stripHeader(src) : fallbackRace(name);
  loaderLines.push(makeInitFn(`race_${id}`, body));
  loaderLines.push('');
}
// Forged (no source function)
loaderLines.push(makeInitFn('race_forged',
  `  setAttr('Species', 'Forged')\n  Owner.setProperty('race_tag', 'forged')\n  announce('Forged race initialized.')\n  return`));
loaderLines.push('');

// Class init functions
loaderLines.push('// ══ CLASS INITS ══');
for (const [name, fnName] of Object.entries(CLASS_DISPATCH)) {
  const id = ident(name);
  const src = allFns[fnName];
  const body = src ? stripHeader(src) : fallbackClass(name);
  loaderLines.push(makeInitFn(`class_${id}`, body));
  loaderLines.push('');
}
// Ironclad Samurai (no source function)
loaderLines.push(makeInitFn('class_ironclad_samurai',
  `  Owner.Attribute('Class').set('Ironclad Samurai')\n  setAttr('Class Fantasy', 'philosopher_warrior_bound_code')\n  announce('Ironclad Samurai initialized.')\n  return`));
loaderLines.push('');

// Subclass init functions — one per combined "Class — Path" option. The
// loader writes the matching per-class Path attribute and announces.
loaderLines.push('// ══ SUBCLASS INITS ══');
const combinedSubclassSuffixByOption = {}; // { combinedOption: fnNameSuffix }
for (const [cls, { attr: pathAttr, raw }] of Object.entries(SUBCLASS_BY_CLASS)) {
  for (const r of raw) {
    const pretty = humanize(r);
    const combinedOption = `${cls} — ${pretty}`;
    const suffix = `sub_${ident(cls)}_${ident(r)}`;
    combinedSubclassSuffixByOption[combinedOption] = suffix;
    const body = [
      `    setAttr('${pathAttr}', '${pretty.replace(/'/g, "\\'")}')`,
      `    Owner.setProperty('subclass_tag', '${ident(cls)}_${ident(r)}')`,
      `    announce('${cls} — ${pretty} path applied.')`,
      `    return`,
    ].join('\n');
    loaderLines.push(`init_${suffix}():\n${body}`);
    loaderLines.push('');
  }
}

// Dispatch block — all if-bodies use 4-space indent (QBScript requirement)
loaderLines.push('// ══════════════════ DISPATCH ══════════════════');
loaderLines.push('species = text(Owner.Attribute(\'Species\').value)');
loaderLines.push('');
loaderLines.push(`if species == 'Forged':`);
loaderLines.push('    init_race_forged()');
for (const name of Object.keys(RACE_DISPATCH)) {
  loaderLines.push(`if species == '${name.replace(/'/g, "\\'")}':`);
  loaderLines.push(`    init_race_${ident(name)}()`);
}
loaderLines.push('');

loaderLines.push('className = text(Owner.Attribute(\'Class\').value)');
loaderLines.push('');
loaderLines.push(`if className == 'Ironclad Samurai':`);
loaderLines.push('    init_class_ironclad_samurai()');
for (const name of Object.keys(CLASS_DISPATCH)) {
  loaderLines.push(`if className == '${name.replace(/'/g, "\\'")}':`);
  loaderLines.push(`    init_class_${ident(name)}()`);
}
loaderLines.push('');

// Combined subclass dispatch — reads the single 'Subclass Selection'
// attribute value ("Class — Path") and fires the matching init.
loaderLines.push("// Combined subclass dispatch — 'Class — Path' value");
loaderLines.push("subclassSelection = text(Owner.Attribute('Subclass Selection').value)");
for (const [opt, suffix] of Object.entries(combinedSubclassSuffixByOption)) {
  loaderLines.push(`if subclassSelection == '${opt.replace(/'/g, "\\'")}':`);
  loaderLines.push(`    init_${suffix}()`);
}
loaderLines.push('');

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

const subclassCount = Object.keys(combinedSubclassSuffixByOption).length;
console.log(`Character loader: ${Object.keys(RACE_DISPATCH).length + 1} races, ${Object.keys(CLASS_DISPATCH).length + 1} classes, ${subclassCount} subclass options`);
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
// WINDOW: SUBCLASS PATH — single combined dropdown. QB doesn't support
// dynamic option filtering by another attribute, and conditional rendering
// doesn't natively hide text/comp-input. The cleanest design is one
// dropdown whose options are prefixed by class name so the user scans to
// their class. A prominent "Class:" echo above makes the filter obvious.
// ───────────────────────────────────────────────────────────────────────
{
  const W = WIN.subclass.id;
  const winW = 440, winH = 180;
  const classAttrId = attrByTitle['Class'];
  const subAttrId = attrByTitle['Subclass Selection'];

  components.push(shape(W, 0, 0, winW, winH, '#0d0d22'));
  addHeader(W, 0, 0, winW, 'SUBCLASS PATH');

  // Current-Class echo — text bound via viewAttributeId (the working 5e
  // pattern) shows the live Class value. The visible label sits to the
  // left of it.
  components.push(shape(W, 10, 46, winW - 20, 42, '#16163a', 6));
  components.push(txt(W, 20, 46, 100, 42, 'CLASS', sText(13, '#a0a0c0', 'start')));
  components.push(comp(W, 'text', 120, 46, winW - 140, 42,
    { value: '{{Class}}', viewAttributeId: classAttrId },
    sText(18, '#ffe08a', 'start', 'bold')));

  // Instructional hint
  components.push(txt(W, 10, 98, winW - 20, 22,
    'Pick the option prefixed with your Class name below.',
    sText(12, '#b0b0d0', 'start')));

  // Single dropdown: all 76 options, class-prefixed
  components.push(txt(W, 10, 126, 90, 36, 'Subclass', sText(13, '#a0a0c0', 'start')));
  components.push(input(W, 100, 126, winW - 110, 36, subAttrId, 'text', 'Choose subclass path'));
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
  // MAIN page: basics + stats + subclass + identity + background
  { winKey: 'basics',     pageKey: 'main', x: 20,  y: 20 },
  { winKey: 'stats',      pageKey: 'main', x: 20,  y: 260 },
  { winKey: 'subclass',   pageKey: 'main', x: 360, y: 260 },
  { winKey: 'identity',   pageKey: 'main', x: 820, y: 260 },
  { winKey: 'background', pageKey: 'main', x: 20,  y: 560 },
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
    composites: 0, compositeVariants: 0, assets: 0, fonts: 0, documents: 0,
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
writeJson('documents.json', []);
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
