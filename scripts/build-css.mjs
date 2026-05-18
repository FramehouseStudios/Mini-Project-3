#!/usr/bin/env node
/**
 * Builds css/style.css from the ordered partials in css/src/.
 *
 *   node scripts/build-css.mjs            # regenerate css/style.css
 *   node scripts/build-css.mjs --check    # fail (exit 1) if style.css is stale
 *
 * Source of truth = css/src/NN-*.css (edit those). Files are concatenated in
 * filename order with NO separator, so the output is byte-for-byte the same
 * shipped stylesheet — the cascade/order is preserved exactly. css/style.css
 * stays committed so the site still works with zero build.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";

const SRC_DIR = new URL("../css/src/", import.meta.url);
const OUT = new URL("../css/style.css", import.meta.url);
const CHECK = process.argv.includes("--check");

const names = (await readdir(SRC_DIR))
  .filter((f) => f.endsWith(".css"))
  .sort((a, b) => a.localeCompare(b, "en"));

if (names.length === 0) {
  console.error("FAIL: no .css partials found in css/src/");
  process.exit(1);
}

let out = "";
for (const name of names) {
  out += await readFile(new URL(name, SRC_DIR), "utf8");
}

if (CHECK) {
  const current = await readFile(OUT, "utf8").catch(() => "");
  if (current !== out) {
    console.error(
      "FAIL: css/style.css is out of date. Run `node scripts/build-css.mjs`.",
    );
    process.exit(1);
  }
  console.log(`OK: css/style.css is in sync (${names.length} partials)`);
  process.exit(0);
}

await writeFile(OUT, out);
console.log(
  `built css/style.css from ${names.length} partials (${out.length} bytes)`,
);
