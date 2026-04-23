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

/** Counters for summary logging. */
const stats = { copied: 0, skipped: 0, errors: 0 };

function safeCopyFile(src, dst) {
  try {
    fs.copyFileSync(src, dst);
    stats.copied++;
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EBUSY") {
      // File is locked (Foundry has it open). Skip without erroring.
      stats.skipped++;
    } else {
      console.error(`  ✕ ${dst}: ${err.message}`);
      stats.errors++;
    }
  }
}

function copyRecursiveMerge(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursiveMerge(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    safeCopyFile(src, dst);
  }
}

function safeRmrf(dst) {
  try {
    fs.rmSync(dst, { recursive: true, force: true });
    return true;
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EBUSY") return false;
    throw err;
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

    if (name === "packs") {
      // Merge into existing packs dir — don't try to remove it (Foundry locks it).
      copyRecursiveMerge(src, dst);
    } else {
      // Fresh replace for everything else
      if (fs.existsSync(dst)) safeRmrf(dst);
      copyRecursiveMerge(src, dst);
    }
  }

  const warn = stats.skipped > 0
    ? ` (${stats.skipped} files skipped — locked by Foundry; close the world to refresh compendia)`
    : "";
  console.log(`Synced: ${stats.copied} copied${warn}. Errors: ${stats.errors}. → ${DST}`);
}

main();
