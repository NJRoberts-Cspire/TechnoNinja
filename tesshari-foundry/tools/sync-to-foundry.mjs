/**
 * Copy everything Foundry needs from the repo to the Foundry save location.
 * Skips node_modules and build caches. Windows paths hardcoded — edit if
 * your user profile differs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..");
const DST = path.resolve(
  process.env.TESSHARI_FOUNDRY_DEST ??
  path.join(process.env.LOCALAPPDATA ?? "", "FoundryVTT", "Data", "systems", "tesshari")
);

const INCLUDE = [
  "system.json",
  "tesshari.mjs",
  "README.md",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "module",
  "lang",
  "styles",
  "templates",
  "tools",
  "packs",
  "packs-src",
];

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

function main() {
  if (!DST) {
    console.error("No destination — set TESSHARI_FOUNDRY_DEST or run on Windows with %LOCALAPPDATA%.");
    process.exit(1);
  }
  fs.mkdirSync(DST, { recursive: true });

  for (const name of INCLUDE) {
    const src = path.join(SRC, name);
    const dst = path.join(DST, name);
    if (!fs.existsSync(src)) continue;
    // Replace existing target
    if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
    copyRecursive(src, dst);
  }

  console.log(`Synced ${INCLUDE.length} entries → ${DST}`);
}

main();
