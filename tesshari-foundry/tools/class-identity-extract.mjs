/**
 * Pull each class's Class Identity / mechanic-intro paragraph from its
 * markdown. This is the "how does this class actually play" summary.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLASSES_DIR = path.resolve(__dirname, "../../classes");

const CLASS_FILES = [
  ["01_ironclad_samurai.md", "Ironclad Samurai"], ["02_ronin.md",          "Ronin"],
  ["03_ashfoot.md",          "Ashfoot"],          ["04_veilblade.md",      "Veilblade"],
  ["05_oni_hunter.md",       "Oni Hunter"],       ["06_forge_tender.md",   "Forge Tender"],
  ["07_wireweave.md",        "Wireweave"],        ["08_chrome_shaper.md",  "Chrome Shaper"],
  ["09_pulse_caller.md",     "Pulse Caller"],     ["10_iron_monk.md",      "Iron Monk"],
  ["11_echo_speaker.md",     "Echo Speaker"],     ["12_void_walker.md",    "Void Walker"],
  ["13_sutensai.md",         "Sutensai"],         ["14_flesh_shaper.md",   "Flesh Shaper"],
  ["15_puppet_binder.md",    "Puppet Binder"],    ["16_blood_smith.md",    "Blood Smith"],
  ["17_the_hollow.md",       "The Hollow"],       ["18_shadow_daimyo.md",  "Shadow Daimyo"],
  ["19_voice_of_debt.md",    "Voice of Debt"],    ["20_merchant_knife.md", "Merchant Knife"],
  ["21_iron_herald.md",      "Iron Herald"],      ["22_curse_eater.md",    "Curse Eater"],
  ["23_shell_dancer.md",     "Shell Dancer"],     ["24_fracture_knight.md","Fracture Knight"],
  ["25_the_unnamed.md",      "The Unnamed"],
];

function extractCardSystemIntro(md) {
  // The mechanic intro follows "## CARD SYSTEM" and precedes "### Starting Hand"
  const startIdx = md.indexOf("## CARD SYSTEM");
  if (startIdx < 0) return "";
  const endIdx = md.indexOf("### Starting Hand", startIdx);
  if (endIdx < 0) return "";
  return md.slice(startIdx, endIdx).trim();
}

function extractResourceLines(intro) {
  // Bold **X (mechanic/resource/status):** patterns
  const lines = [];
  const re = /\*\*([^*]+)\*\*\s*([^\n]*)/g;
  let m;
  while ((m = re.exec(intro)) !== null) {
    const label = m[1].trim();
    const body = m[2].trim();
    if (/mechanic|resource|status|pool|currency|stat\)/i.test(label)) {
      lines.push({ label, body: body.slice(0, 200) });
    }
  }
  return lines;
}

function extractFirstCards(md, count = 3) {
  // First few cards in the starting hand section
  const startIdx = md.indexOf("### Starting Hand");
  if (startIdx < 0) return [];
  const section = md.slice(startIdx, startIdx + 4000);
  const cards = [...section.matchAll(/^### ([^\n#][^\n]*)/gm)]
    .map(m => m[1].trim())
    .filter(n => !/^(Starting Hand|Level Unlock|Full Card Reference)/.test(n))
    .slice(0, count);
  return cards;
}

console.log("# Class Playstyle Audit\n");
console.log("Each class's core mechanic — what the player actually does moment-to-moment.\n");

for (const [file, name] of CLASS_FILES) {
  const md = fs.readFileSync(path.join(CLASSES_DIR, file), "utf8");
  const intro = extractCardSystemIntro(md);
  const resources = extractResourceLines(intro);
  const firstCards = extractFirstCards(md);

  // Extract HP tier, Hand Size, Primary Stats
  const hpTier = (intro.match(/\*\*HP Tier:\*\*\s*([^\n]+)/)?.[1] ?? "").trim();
  const hand   = (intro.match(/\*\*Hand Size:\*\*\s*([^\n]+)/)?.[1] ?? "").trim();
  const stats  = (intro.match(/\*\*Primary Stats:\*\*\s*([^\n]+)/)?.[1] ?? "").trim();

  console.log(`## ${name}`);
  console.log(`- **Stats:** ${stats}`);
  if (hpTier) console.log(`- **HP Tier:** ${hpTier} · **Hand:** ${hand}`);
  else        console.log(`- **Hand:** ${hand}`);
  if (resources.length) {
    console.log(`- **Core mechanics:**`);
    for (const r of resources) console.log(`  - **${r.label}** — ${r.body}`);
  }
  if (firstCards.length) console.log(`- **Starting hand (first 3):** ${firstCards.join(", ")}`);
  console.log();
}
