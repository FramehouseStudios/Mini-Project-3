#!/usr/bin/env node
/**
 * Conservative dead-CSS auditor — zero dependencies, READ-ONLY (reports only).
 *
 *   node scripts/audit-css.mjs            # summary
 *   node scripts/audit-css.mjs --list     # also print every dead rule selector
 *
 * "Used token" = any class/id-looking word that appears in ANY string in the
 * HTML or JS (template literals, classList calls, querySelector, etc.). We
 * over-collect on purpose: a rule is only flagged DEAD when EVERY class/id
 * base-name across its whole selector list is absent from that set. Selectors
 * containing element/`*`/attribute/:root parts are never flagged. This biases
 * hard toward false-negatives (keep too much) so anything it flags is safe to
 * remove.
 */
import { readdir, readFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);
const LIST = process.argv.includes("--list");

async function read(p) {
  return readFile(new URL(p, ROOT), "utf8").catch(() => "");
}

const htmlFiles = (await readdir(ROOT)).filter((f) => f.endsWith(".html"));
const jsFiles = (await readdir(new URL("js/", ROOT)))
  .filter((f) => f.endsWith(".js"))
  .map((f) => `js/${f}`);

let markup = "";
for (const f of [...htmlFiles, ...jsFiles]) markup += "\n" + (await read(f));

// Used tokens: every identifier-ish word anywhere in markup/JS strings + raw.
const used = new Set();
for (const m of markup.matchAll(/[A-Za-z_][\w-]*/g)) used.add(m[0]);

const css = await read("css/style.css");

// Walk top-level + nested rules. Strip comments first.
const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
const rules = []; // { selector, start, end }
function parseBlock(text, base) {
  let depth = 0;
  let buf = "";
  let segStart = 0;
  for (let p = 0; p < text.length; p++) {
    const ch = text[p];
    if (ch === "{") {
      if (depth === 0) {
        const sel = buf.trim();
        // find matching close
        let d = 1;
        let q = p + 1;
        for (; q < text.length && d > 0; q++) {
          if (text[q] === "{") d++;
          else if (text[q] === "}") d--;
        }
        const body = text.slice(p + 1, q - 1);
        if (/^@(media|supports|container)/i.test(sel)) {
          parseBlock(body, base + segStart);
        } else if (!sel.startsWith("@")) {
          rules.push({ selector: sel.replace(/\s+/g, " "), len: q - segStart });
        }
        p = q - 1;
        buf = "";
        segStart = p + 1;
      }
    } else if (ch === "}") {
      buf = "";
      segStart = p + 1;
    } else {
      buf += ch;
    }
  }
}
parseBlock(clean, 0);

function classIds(selector) {
  return [...selector.matchAll(/[.#]([A-Za-z_][\w-]*)/g)].map((m) => m[1]);
}
function hasRiskyPart(selector) {
  // element/star/attribute/:root/pseudo-element-only segments we won't reason about
  return /(^|[\s,>+~])(\*|[a-z][\w-]*|\[)/i.test(
    selector.replace(/[.#][A-Za-z_][\w-]*/g, "").replace(/::?[\w-]+(\([^)]*\))?/g, ""),
  );
}

const dead = [];
for (const r of rules) {
  const tokens = classIds(r.selector);
  if (tokens.length === 0) continue; // no class/id -> skip (element/global)
  if (hasRiskyPart(r.selector)) continue; // mixed with element/attr -> keep
  if (tokens.every((t) => !used.has(t))) {
    dead.push(r);
  }
}

const totalRules = rules.length;
const deadLines = dead.reduce((n, r) => n + r.len, 0);
const cssLines = css.split("\n").length;
console.log(`css/style.css: ${cssLines} lines, ${totalRules} style rules`);
console.log(`used class/id-ish tokens in HTML+JS: ${used.size}`);
console.log(
  `DEAD candidate rules (all class/id tokens unreferenced): ${dead.length}` +
    ` (~${deadLines} chars, ~${(deadLines / Math.max(1, css.length) * 100).toFixed(1)}% of file)`,
);
if (LIST) {
  for (const r of dead) console.log("  ✗ " + r.selector.slice(0, 110));
}
