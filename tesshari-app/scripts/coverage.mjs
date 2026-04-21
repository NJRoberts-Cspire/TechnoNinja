// Reports per-class card count gaps so you can see where to add content.
// Run: node scripts/coverage.mjs (from tesshari-app/)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..');
const TSV = path.join(REPO_ROOT, 'questbound/import_tsv/aligned_for_qb/actions_READY.tsv');

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

function tier(cat) {
  const c = String(cat || '').toLowerCase();
  if (c.includes('capstone')) return 'L20';
  if (c.includes('subclass_power')) return 'L9';
  if (c.includes('subclass')) return 'L3';
  if (c.includes('power')) return 'L5';
  if (c.includes('level_up')) return 'L2';
  return 'L1';
}

function unesc(s) {
  if (!s) return '';
  s = s.replace(/\r$/, '');
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/""/g, '"');
  return s;
}

const text = fs.readFileSync(TSV, 'utf8').replace(/^﻿/, '');
const lines = text.split(/\r?\n/).filter(Boolean);
const headers = lines[0].split('\t');
const rows = lines.slice(1).map((l) => {
  const cells = l.split('\t');
  const r = {};
  headers.forEach((h, i) => (r[h] = unesc(cells[i] ?? '')));
  return r;
});

const byClass = {};
for (const [cls, prefix] of Object.entries(CLASS_TO_PREFIX)) {
  const a1 = `act_${prefix}_`, a2 = `card_${prefix}_`;
  const list = rows.filter((r) => r.id.startsWith(a1) || r.id.startsWith(a2));
  const tiers = { L1: 0, L2: 0, L3: 0, L5: 0, L9: 0, L20: 0 };
  for (const r of list) tiers[tier(r.category)]++;
  byClass[cls] = { total: list.length, tiers };
}

// Target per class
const TARGET = { L1: 12, L2: 2, L3: 4, L5: 3, L9: 2, L20: 1 };
const TARGET_TOTAL = Object.values(TARGET).reduce((s, n) => s + n, 0);

// Print
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('Class', 20), pad('Total', 7), 'L1   L2   L3   L5   L9   L20   Gap');
console.log('-'.repeat(70));
const sorted = Object.entries(byClass).sort((a, b) => a[1].total - b[1].total);
for (const [cls, { total, tiers }] of sorted) {
  const gap = TARGET_TOTAL - total;
  const gapColor = gap > 20 ? '\x1b[31m' : gap > 10 ? '\x1b[33m' : '\x1b[32m';
  const reset = '\x1b[0m';
  console.log(
    pad(cls, 20),
    pad(total, 7),
    pad(tiers.L1, 5), pad(tiers.L2, 5), pad(tiers.L3, 5),
    pad(tiers.L5, 5), pad(tiers.L9, 5), pad(tiers.L20, 5),
    `${gapColor}${gap > 0 ? `-${gap}` : '+' + -gap}${reset}`,
  );
}

console.log('-'.repeat(70));
console.log(`Target per class: ${TARGET_TOTAL} cards (L1·${TARGET.L1} L2·${TARGET.L2} L3·${TARGET.L3} L5·${TARGET.L5} L9·${TARGET.L9} L20·${TARGET.L20})`);
console.log(`Total in TSV: ${rows.length} rows, ${Object.values(byClass).reduce((s, x) => s + x.total, 0)} class-attached.`);
