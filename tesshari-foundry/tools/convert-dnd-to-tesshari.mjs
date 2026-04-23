/**
 * Convert D&D 5e-style language in class/race markdown to Tesshari conventions.
 *
 *   STR / Strength      → IRON
 *   DEX / Dexterity     → EDGE
 *   CON / Constitution  → FRAME
 *   INT / Intelligence  → SIGNAL
 *   WIS / Wisdom        → RESONANCE
 *   CHA / Charisma      → VEIL
 *
 *   NdM(+K)             → fixed integer = N×((M+1)/2) + K
 *   "saving throw"      → "resistance check"
 *   "save"              → "resistance check" (in check context)
 *   "temporary hit points" → "Shield"
 *   "CR N" / "challenge rating N" → "Tier N"
 *   "advantage on X"    → "+3 to X"
 *   "disadvantage on X" → "−3 to X"
 *   "DC N"              → "difficulty N"
 *   "class level"       → "character level"
 *   "proficiency bonus" → "class expertise"
 *
 * Only rewrites CLASS and RACE markdown files (under classes/, races/).
 * Preserves the original file on `--dry-run`; otherwise overwrites in place
 * and prints a diff summary.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const DRY_RUN = process.argv.includes("--dry-run");

/** Deterministic replacement for NdM(+K) dice notation. */
function diceToFixed(n, m, k = 0) {
  const avg = Math.round(n * ((m + 1) / 2));
  return String(avg + k);
}

const transforms = [
  // ───── stat modifiers and names ─────────────────────────────────────
  { re: /\bStrength\s+(modifier|save|score|check)\b/g,     to: "IRON" },
  { re: /\bDexterity\s+(modifier|save|score|check)\b/g,    to: "EDGE" },
  { re: /\bConstitution\s+(modifier|save|score|check)\b/g, to: "FRAME" },
  { re: /\bIntelligence\s+(modifier|save|score|check)\b/g, to: "SIGNAL" },
  { re: /\bWisdom\s+(modifier|save|score|check)\b/g,       to: "RESONANCE" },
  { re: /\bCharisma\s+(modifier|save|score|check)\b/g,     to: "VEIL" },

  // Standalone stat references (bare word)
  { re: /\bStrength\b/g,     to: "IRON" },
  { re: /\bDexterity\b/g,    to: "EDGE" },
  { re: /\bConstitution\b/g, to: "FRAME" },
  { re: /\bIntelligence\b/g, to: "SIGNAL" },
  { re: /\bWisdom\b/g,       to: "RESONANCE" },
  { re: /\bCharisma\b/g,     to: "VEIL" },

  // Short forms (case-insensitive) — Str, Dex, Con, etc.
  { re: /\bStr\b/g, to: "IRON" },
  { re: /\bDex\b/g, to: "EDGE" },
  { re: /\bCon\b/g, to: "FRAME" },
  { re: /\bInt\b/g, to: "SIGNAL" },
  { re: /\bWis\b/g, to: "RESONANCE" },
  { re: /\bCha\b/g, to: "VEIL" },
  { re: /\bSTR\b/g, to: "IRON" },
  { re: /\bDEX\b/g, to: "EDGE" },
  { re: /\bCON\b/g, to: "FRAME" },
  { re: /\bINT\b/g, to: "SIGNAL" },
  { re: /\bWIS\b/g, to: "RESONANCE" },
  { re: /\bCHA\b/g, to: "VEIL" },

  // ───── dice rolls → fixed integers (diceless system) ─────────────────
  { re: /\b(\d+)d(\d+)\s*\+\s*(\d+)\b/g, to: (_, n, m, k) => diceToFixed(+n, +m, +k) },
  { re: /\b(\d+)d(\d+)\s*-\s*(\d+)\b/g, to: (_, n, m, k) => diceToFixed(+n, +m, -k) },
  { re: /\b(\d+)d(\d+)\b/g,              to: (_, n, m) => diceToFixed(+n, +m) },

  // ───── save/check vocabulary ─────────────────────────────────────────
  { re: /\bsaving throws?\b/gi, to: "resistance check" },
  { re: /\bsaves?\b(?=\s+(against|vs|versus))/gi, to: "resistance check" },
  { re: /\btemporary hit points?\b/gi, to: "Shield" },
  { re: /\btemp HP\b/gi,         to: "Shield" },
  { re: /\bhit points?\b/gi,     to: "HP" },

  // ───── challenge rating → tier ───────────────────────────────────────
  { re: /\bCR\s+(\d+)\b/g,                           to: "Tier $1" },
  { re: /\bchallenge rating(?:\s+of)?\s+(\d+)\b/gi,  to: "Tier $1" },

  // ───── advantage / disadvantage → flat bonuses (mechanical only) ────
  // The bare words "advantage" / "disadvantage" appear in narrative prose
  // with their ordinary English meaning (e.g., "significant disadvantage",
  // "information advantages") — only the mechanical phrasings are rewritten.
  { re: /\badvantage on\b/gi,             to: "+3 to" },
  { re: /\bdisadvantage on\b/gi,          to: "−3 to" },
  { re: /\bgain advantage\b/gi,           to: "gain +3" },
  { re: /\bhas advantage\b/gi,            to: "has +3" },
  { re: /\bhave advantage\b/gi,           to: "gain +3" },
  { re: /\bat advantage\b/gi,             to: "with +3" },
  { re: /\bwith advantage\b/gi,           to: "with +3" },
  { re: /\bhave disadvantage\b/gi,        to: "suffer −3" },
  { re: /\bhas disadvantage\b/gi,         to: "suffers −3" },
  { re: /\bat disadvantage\b/gi,          to: "with −3" },
  { re: /\bno disadvantage\b/gi,          to: "no penalty" },
  { re: /\bmade at disadvantage\b/gi,     to: "penalized" },
  { re: /\battacks? at disadvantage\b/gi, to: "attack with −3" },

  // ───── difficulty / AC / misc ───────────────────────────────────────
  { re: /\bDC\s*=\s*[^)\n,]+/g,                           to: "difficulty (stat-based)" },
  { re: /\bDC\s+(\d+)\b/g,                                to: "difficulty $1" },
  { re: /\bdifficulty class\s+(\d+)\b/gi,                 to: "difficulty $1" },
  { re: /\bAC\s+is\s+irrelevant\b/gi,                     to: "this bypasses all mitigation" },
  { re: /\b(?:Armor Class|AC)\s+\d+/g,                    to: "defense" },
  { re: /\bclass level\b/gi,                              to: "character level" },
  { re: /\bproficiency bonus\b/gi,                        to: "class expertise" },
  { re: /\bsave DC\b/gi,                                  to: "difficulty" },
  { re: /\bspell save\b/gi,                               to: "resistance" },

  // ───── damage types → Tesshari equivalents ──────────────────────────
  { re: /\bnecrotic damage\b/gi,   to: "resonant damage" },
  { re: /\bforce damage\b/gi,      to: "resonant damage" },
  { re: /\bpsychic damage\b/gi,    to: "signal damage" },
  { re: /\bradiant damage\b/gi,    to: "resonant damage" },
  { re: /\bthunder damage\b/gi,    to: "signal damage" },
  { re: /\bcold damage\b/gi,       to: "resonant damage" },
  { re: /\bfire damage\b/gi,       to: "physical damage" },
  { re: /\blightning damage\b/gi,  to: "signal damage" },
  { re: /\bacid damage\b/gi,       to: "physical damage" },
  { re: /\bpoison damage\b/gi,     to: "physical damage" },

  // Clean up artifacts
  { re: /\bresistance check\s+check\b/gi, to: "resistance check" },
];

function transformText(text) {
  let out = text;
  const hits = {};
  for (const t of transforms) {
    const matches = out.match(t.re);
    if (matches) {
      hits[String(t.re)] = (hits[String(t.re)] ?? 0) + matches.length;
      out = out.replace(t.re, t.to);
    }
  }
  return { out, hits };
}

function processDir(subdir, summary) {
  const dir = path.join(REPO_ROOT, subdir);
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const fp = path.join(dir, file);
    const orig = fs.readFileSync(fp, "utf8");
    const { out, hits } = transformText(orig);
    const changes = Object.values(hits).reduce((a, b) => a + b, 0);
    if (changes > 0) {
      summary.push({ file: path.relative(REPO_ROOT, fp), changes });
      if (!DRY_RUN) fs.writeFileSync(fp, out);
    }
  }
}

const summary = [];
processDir("classes", summary);
processDir("races",   summary);

summary.sort((a, b) => b.changes - a.changes);
console.log(DRY_RUN ? "DRY RUN — no files written" : "Rewriting files in place");
console.log(`${summary.length} files changed.`);
for (const s of summary) console.log(`  ${s.changes.toString().padStart(4)}  ${s.file}`);
const total = summary.reduce((a, b) => a + b.changes, 0);
console.log(`Total replacements: ${total}`);
