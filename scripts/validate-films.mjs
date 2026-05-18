#!/usr/bin/env node
/**
 * Blockbuster+ film catalog validator — zero dependencies.
 *
 *   node scripts/validate-films.mjs            # offline structural validation
 *   node scripts/validate-films.mjs --check-urls   # also HEAD-checks every poster
 *   node scripts/validate-films.mjs --quiet        # only print on failure
 *
 * Exit code 0 = valid, 1 = one or more errors (CI-friendly).
 * Contract enforced here matches docs/data-schema.md.
 */

import { readFile } from "node:fs/promises";

const DATA_URL = new URL("../data/films.json", import.meta.url);

const GENRES = ["Action", "Drama", "Horror", "Sci-Fi", "Romance", "Animation"];
const MOODS = [
  "Angry", "Burned out", "Dissociated", "Dreamy", "Euphoric", "Heartbroken",
  "Hopeful", "Inspired", "Lonely", "Nostalgic", "Numb", "Romantic",
];
const WEATHER = [
  "Clear night", "Foggy", "Neon city", "Overcast", "Raining", "Snowing",
  "Summer heat", "Sunrise", "Thunderstorm", "Windy",
];

const args = new Set(process.argv.slice(2));
const CHECK_URLS = args.has("--check-urls");
const QUIET = args.has("--quiet");
const MAX_YEAR = new Date().getFullYear() + 2;

const errors = [];
const warnings = [];

function err(where, message) {
  errors.push(`${where}: ${message}`);
}
function warn(where, message) {
  warnings.push(`${where}: ${message}`);
}

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isInt = (v) => Number.isInteger(v);
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

function validateReview(where, r) {
  if (typeof r !== "object" || r === null || Array.isArray(r)) {
    return err(where, "must be an object");
  }
  if (!(isNum(r.stars) && r.stars >= 0 && r.stars <= 5 && Number.isInteger(r.stars * 2))) {
    err(where, `stars must be 0..5 in 0.5 steps (got ${JSON.stringify(r.stars)})`);
  }
  if (!isStr(r.username)) err(where, "username must be a non-empty string");
  if (!isStr(r.avatar) || r.avatar.length > 4) {
    err(where, `avatar must be a 1-4 char string (got ${JSON.stringify(r.avatar)})`);
  }
  if (!isStr(r.quote)) err(where, "quote must be a non-empty string");
}

function validateStringArray(where, value, { vocab } = {}) {
  if (!Array.isArray(value) || value.length === 0) {
    return err(where, "must be a non-empty array");
  }
  value.forEach((item, i) => {
    if (!isStr(item)) {
      err(`${where}[${i}]`, "must be a non-empty string");
    } else if (vocab && !vocab.includes(item)) {
      err(`${where}[${i}]`, `"${item}" is not in the allowed vocabulary`);
    }
  });
}

function validateFilm(film, index, seenIds) {
  const id = film && film.id;
  const where = `film[${index}] (id=${id ?? "?"})`;

  if (typeof film !== "object" || film === null || Array.isArray(film)) {
    return err(`film[${index}]`, "must be an object");
  }

  if (!isInt(id) || id < 1) {
    err(where, "id must be an integer >= 1");
  } else if (seenIds.has(id)) {
    err(where, `duplicate id ${id}`);
  } else {
    seenIds.add(id);
  }

  for (const k of ["title", "director", "favoriteScene", "description",
    "soundtrack", "drinkPairing", "cinematicQuote", "visualMood",
    "emotionalSynopsis"]) {
    if (!isStr(film[k])) err(where, `${k} must be a non-empty string`);
  }

  if (!GENRES.includes(film.genre)) {
    err(where, `genre "${film.genre}" not in [${GENRES.join(", ")}]`);
  }
  if (!(isInt(film.year) && film.year >= 1900 && film.year <= MAX_YEAR)) {
    err(where, `year must be an integer 1900..${MAX_YEAR} (got ${JSON.stringify(film.year)})`);
  }
  if (!(isNum(film.rating) && film.rating >= 0 && film.rating <= 10)) {
    err(where, `rating must be a number 0..10 (got ${JSON.stringify(film.rating)})`);
  }
  if (!(isInt(film.runtime) && film.runtime >= 1 && film.runtime <= 1000)) {
    err(where, `runtime must be an integer 1..1000 (got ${JSON.stringify(film.runtime)})`);
  }
  if (!(isInt(film.rewatches) && film.rewatches >= 0)) {
    err(where, `rewatches must be an integer >= 0 (got ${JSON.stringify(film.rewatches)})`);
  }
  if (!(isInt(film.lateNightScore) && film.lateNightScore >= 0 && film.lateNightScore <= 100)) {
    err(where, `lateNightScore must be an integer 0..100 (got ${JSON.stringify(film.lateNightScore)})`);
  }

  validateStringArray(`${where}.vibeTags`, film.vibeTags);
  validateStringArray(`${where}.cultureTags`, film.cultureTags);
  validateStringArray(`${where}.moods`, film.moods, { vocab: MOODS });
  validateStringArray(`${where}.weatherTags`, film.weatherTags, { vocab: WEATHER });

  let posterUrl = null;
  try {
    posterUrl = new URL(film.poster);
    if (posterUrl.protocol !== "https:") {
      err(where, `poster must be an https URL (got ${posterUrl.protocol})`);
    } else if (posterUrl.host !== "image.tmdb.org") {
      warn(where, `poster host is ${posterUrl.host} (expected image.tmdb.org)`);
    }
  } catch {
    err(where, `poster is not a valid URL: ${JSON.stringify(film.poster)}`);
  }

  try {
    const t = new URL(film.trailer);
    if (t.protocol !== "https:") {
      err(where, `trailer must be an https URL (got ${t.protocol})`);
    } else if (t.host !== "www.youtube.com" && t.host !== "youtube.com") {
      err(where, `trailer host must be youtube.com (got ${t.host})`);
    } else if (!/^\/embed\/[\w-]+$/.test(t.pathname)) {
      err(where, `trailer must be a /embed/<id> URL (got ${t.pathname})`);
    }
  } catch {
    err(where, `trailer is not a valid URL: ${JSON.stringify(film.trailer)}`);
  }

  validateReview(`${where}.review`, film.review);
  if (!Array.isArray(film.reviews) || film.reviews.length === 0) {
    err(`${where}.reviews`, "must be a non-empty array");
  } else {
    film.reviews.forEach((r, i) => validateReview(`${where}.reviews[${i}]`, r));
  }

  return posterUrl ? film.poster : null;
}

async function headOk(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    // Some CDNs reject HEAD; fall back to a ranged GET.
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" }, signal: ctrl.signal });
    }
    return res.ok || res.status === 206;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  let raw;
  try {
    raw = await readFile(DATA_URL, "utf8");
  } catch (e) {
    console.error(`FAIL: cannot read data/films.json (${e.message})`);
    process.exit(1);
  }

  let films;
  try {
    films = JSON.parse(raw);
  } catch (e) {
    console.error(`FAIL: data/films.json is not valid JSON (${e.message})`);
    process.exit(1);
  }

  if (!Array.isArray(films) || films.length === 0) {
    console.error("FAIL: top-level value must be a non-empty array of films");
    process.exit(1);
  }

  const seenIds = new Set();
  const posters = [];
  films.forEach((film, i) => {
    const p = validateFilm(film, i, seenIds);
    if (p) posters.push(p);
  });

  if (CHECK_URLS && errors.length === 0) {
    const unique = [...new Set(posters)];
    const results = await Promise.all(
      unique.map(async (u) => ({ u, ok: await headOk(u) })),
    );
    for (const { u, ok } of results) {
      if (!ok) err("poster-url", `unreachable: ${u}`);
    }
  }

  if (warnings.length && !QUIET) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  if (errors.length) {
    console.error(`\nFAIL: ${errors.length} error(s) in data/films.json:`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  if (!QUIET) {
    console.log(
      `OK: ${films.length} films valid` +
        (CHECK_URLS ? `, ${new Set(posters).size} poster URLs reachable` : "") +
        (warnings.length ? ` (${warnings.length} warning(s))` : ""),
    );
  }
  process.exit(0);
}

main();
