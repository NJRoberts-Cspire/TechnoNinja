/**
 * Load tesshari-app/src/data/generated.ts as a plain JS module.
 *
 * The source is hand-authored TypeScript with simple type annotations, no
 * generics beyond `Record<>`, no decorators, no imports. We can strip the
 * TypeScript syntax with regex and evaluate the remainder as plain JS.
 *
 * Exports: whatever `export const` declarations exist in the file.
 */

import fs from "node:fs";

/**
 * Strip TypeScript-only syntax from the source so it evaluates as JS.
 */
function stripTypes(src) {
  return src
    // `export interface X { ... }` and `interface X { ... }` — no nested braces
    .replace(/^export\s+interface\s+\w+[^{]*\{[^}]*\}\s*$/gms, "")
    .replace(/^interface\s+\w+[^{]*\{[^}]*\}\s*$/gms, "")
    // `export type X = ...;` aliases
    .replace(/^export\s+type\s+\w+[^;]+;\s*$/gm, "")
    // `: Type` annotations on const declarations (before `=`, lazy to stop at `=`)
    .replace(/(\bexport\s+const\s+\w+)\s*:\s*[^=]+?(\s*=)/g, "$1$2")
    // `as const` suffix
    .replace(/\s+as\s+const\b/g, "")
    // `satisfies X` clauses
    .replace(/\s+satisfies\s+[\w<>,\s|[\]]+/g, "");
}

/**
 * Load and return all `export const` values from a TS file as an object.
 */
export function loadGenerated(tsPath) {
  const src = fs.readFileSync(tsPath, "utf8");
  const js = stripTypes(src);

  const exportNames = [];
  const cjsLike = js.replace(/^export\s+const\s+(\w+)/gm, (_, name) => {
    exportNames.push(name);
    return `const ${name}`;
  });

  const wrapped = `${cjsLike}\nreturn { ${exportNames.join(", ")} };`;
  const fn = new Function(wrapped);
  return fn();
}
