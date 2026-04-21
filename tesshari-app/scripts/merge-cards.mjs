// Merges all per-class staging files in tesshari-app/staging/cards/*.tsv
// into the main actions_READY.tsv, skipping any rows whose `id` already
// exists in the main file (so reruns are safe).
//
// Run: node scripts/merge-cards.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(ROOT, '..');
const MAIN_TSV = path.join(REPO_ROOT, 'questbound/import_tsv/aligned_for_qb/actions_READY.tsv');
const STAGING = path.join(ROOT, 'staging/cards');

if (!fs.existsSync(STAGING)) {
  console.error(`No staging dir at ${STAGING}. Nothing to merge.`);
  process.exit(0);
}

const files = fs.readdirSync(STAGING).filter((f) => f.endsWith('.tsv')).map((f) => path.join(STAGING, f));
if (files.length === 0) {
  console.error('No .tsv files in staging/cards/. Nothing to merge.');
  process.exit(0);
}

// Read existing IDs in the main file
const mainText = fs.readFileSync(MAIN_TSV, 'utf8');
const mainLines = mainText.split(/\r?\n/);
const header = mainLines[0];
const existingIds = new Set();
for (let i = 1; i < mainLines.length; i++) {
  const line = mainLines[i].trim();
  if (!line) continue;
  const id = line.split('\t')[0];
  if (id) existingIds.add(id);
}
const expectedCols = header.split('\t').length;

const toAppend = [];
const stats = {
  filesProcessed: 0,
  rowsAccepted: 0,
  rowsDuplicate: 0,
  rowsMalformed: 0,
  rowsCommented: 0,
};

for (const f of files) {
  stats.filesProcessed++;
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) { stats.rowsCommented++; continue; }
    // Allow trailing tabs by counting splits, not cells
    const cells = raw.split('\t');
    if (cells.length < 4) { stats.rowsMalformed++; console.warn(`  ! malformed (too few cols) in ${path.basename(f)}: ${raw.slice(0, 80)}`); continue; }
    const id = cells[0].trim();
    if (!id) { stats.rowsMalformed++; continue; }
    if (existingIds.has(id)) { stats.rowsDuplicate++; continue; }
    // Pad to expected col count with empty cells
    while (cells.length < expectedCols) cells.push('');
    const normalizedRow = cells.slice(0, expectedCols).join('\t');
    existingIds.add(id);
    toAppend.push(normalizedRow);
    stats.rowsAccepted++;
  }
}

if (toAppend.length === 0) {
  console.log(`Nothing new to merge. (Files: ${stats.filesProcessed}, duplicates skipped: ${stats.rowsDuplicate}, malformed: ${stats.rowsMalformed})`);
  process.exit(0);
}

// Append to main TSV
const newContent = (mainText.endsWith('\n') ? mainText : mainText + '\n') + toAppend.join('\n') + '\n';
fs.writeFileSync(MAIN_TSV, newContent, 'utf8');

console.log(`Merged ${stats.rowsAccepted} new rows from ${stats.filesProcessed} files into ${path.basename(MAIN_TSV)}.`);
console.log(`  Duplicates skipped: ${stats.rowsDuplicate}`);
console.log(`  Commented lines ignored: ${stats.rowsCommented}`);
if (stats.rowsMalformed) console.log(`  Malformed rows skipped: ${stats.rowsMalformed}`);
