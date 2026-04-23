/**
 * Build a per-class playstyle fingerprint by scanning the class markdown.
 * Dumps a table + per-class detail block so overlapping classes are visible.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const CLASS_FILES = {
  "Ironclad Samurai": "01_ironclad_samurai",   "Ronin":           "02_ronin",
  "Ashfoot":          "03_ashfoot",             "Veilblade":        "04_veilblade",
  "Oni Hunter":       "05_oni_hunter",          "Forge Tender":     "06_forge_tender",
  "Wireweave":        "07_wireweave",           "Chrome Shaper":    "08_chrome_shaper",
  "Pulse Caller":     "09_pulse_caller",        "Iron Monk":        "10_iron_monk",
  "Echo Speaker":     "11_echo_speaker",        "Void Walker":      "12_void_walker",
  "Sutensai":         "13_sutensai",            "Flesh Shaper":     "14_flesh_shaper",
  "Puppet Binder":    "15_puppet_binder",       "Blood Smith":      "16_blood_smith",
  "The Hollow":       "17_the_hollow",          "Shadow Daimyo":    "18_shadow_daimyo",
  "Voice of Debt":    "19_voice_of_debt",       "Merchant Knife":   "20_merchant_knife",
  "Iron Herald":      "21_iron_herald",         "Curse Eater":      "22_curse_eater",
  "Shell Dancer":     "23_shell_dancer",        "Fracture Knight":  "24_fracture_knight",
  "The Unnamed":      "25_the_unnamed",
};

function extractBoldField(md, field) {
  const re = new RegExp(`\\*\\*${field}:\\*\\*\\s*([^\\n]+)`, "i");
  return (md.match(re)?.[1] ?? "").trim();
}

function extractStartingHand(md) {
  const idx = md.indexOf("### Starting Hand");
  if (idx < 0) return [];
  const section = md.slice(idx, idx + 1500);
  const stopIdx = section.slice(20).search(/\n#{2,4}\s/);
  const sectionBody = stopIdx > 0 ? section.slice(0, stopIdx + 20) : section;
  const matches = [...sectionBody.matchAll(/^- \*\*([^*]+?)\*\*/gm)].map(m => m[1].trim());
  return matches.slice(0, 5);
}

function findSignatureMechanics(md) {
  // Look for class-unique resource names: proper-cased two-word phrases that
  // appear 3+ times are likely named resources / mechanics.
  const candidates = [...md.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)];
  const counts = {};
  for (const [, m] of candidates) counts[m] = (counts[m] ?? 0) + 1;
  // Filter to noun-phrases that look like mechanics
  const LIKELY = /(Points|Charges?|Stacks?|Oath|Vein|Thread|Vessel|Forge|Between|Corruption|Fracture|Anchor|Mark|Shell|Echo|Signal|Blood|Mirror|Weave|Node|Loop|Witness|Bond|Sigil|Bond|Memory|Pulse|Resonance|Surge|Phase|Form|Seal|Ward|Sutra|Kata|Stance|Rite|Path)/;
  return Object.entries(counts)
    .filter(([k, v]) => v >= 3 && LIKELY.test(k) && k.length > 3 && !k.match(/^(The|Level|Iron|Card|Attack|Defense|Class|Starting|Full|Hand|HP|AP|Damage|Target|Creature|Enemy|Ally)$/))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => `${k}×${v}`);
}

function findKeywords(md) {
  // Tesshari status keywords mentioned as cards
  const keywords = ["Guard", "Shield", "Bleed", "Burn", "Expose", "Vulnerable",
                    "Overheat", "Stagger", "Root", "Silence", "Taunt", "Mark",
                    "Fortify", "Regen", "Veil", "Cleanse", "Dispel", "Pierce", "Echo"];
  const counts = {};
  for (const kw of keywords) {
    const re = new RegExp(`\\b${kw}\\b`, "g");
    const n = (md.match(re) ?? []).length;
    if (n >= 3) counts[kw] = n;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function extractShortFantasy(md) {
  // The class fantasy line comes from the first overview paragraph
  const idx = md.indexOf("## Overview");
  if (idx < 0) return "";
  const body = md.slice(idx + 12, idx + 2500).trim();
  const firstSentence = body.split(/[.!?]\s/)[0].replace(/\n/g, " ").trim();
  return firstSentence.slice(0, 220);
}

const rows = [];
for (const [className, fileBase] of Object.entries(CLASS_FILES)) {
  const fp = path.join(REPO_ROOT, "classes", fileBase + ".md");
  const md = fs.readFileSync(fp, "utf8");
  rows.push({
    className,
    primaryStats: extractBoldField(md, "Primary Stats"),
    hpTier:       extractBoldField(md, "HP Tier"),
    handSize:     extractBoldField(md, "Hand Size"),
    starting:     extractStartingHand(md),
    resources:    findSignatureMechanics(md),
    keywords:     findKeywords(md).slice(0, 6).map(([k, n]) => `${k}×${n}`),
    fantasy:      extractShortFantasy(md),
  });
}

console.log("=".repeat(110));
console.log("PLAYSTYLE FINGERPRINT MATRIX");
console.log("=".repeat(110));
console.log();

// Group by primary-stat pair for overlap detection
const byStats = {};
for (const r of rows) {
  const key = r.primaryStats.replace(/\s+/g, " ").toLowerCase().split(" ").sort().join(" ");
  (byStats[key] = byStats[key] ?? []).push(r);
}
for (const [statPair, classes] of Object.entries(byStats)) {
  console.log(`\n--- Stats: ${statPair} (${classes.length} class${classes.length > 1 ? "es" : ""}) ---`);
  for (const c of classes) {
    console.log(`\n  ${c.className}  [${c.hpTier} / hand ${c.handSize}]`);
    console.log(`    Primary:      ${c.primaryStats}`);
    console.log(`    Starting:     ${c.starting.join(", ") || "(none extracted)"}`);
    console.log(`    Resources:    ${c.resources.join(", ") || "—"}`);
    console.log(`    Top keywords: ${c.keywords.join(", ") || "—"}`);
    console.log(`    Fantasy:      ${c.fantasy}`);
  }
}
