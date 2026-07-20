const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  buildTrailerEmbedSrc,
  hydrateRentalBagFromIds,
  parseMoodText,
  resolveTrailerFilmById,
  scoreFreeText,
  serializeRentalBagIds,
} = require("../js/blockbuster-logic.js");

const films = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "films.json"), "utf8"),
);

test("free-text mood parser extracts emotional, weather, and need signals", () => {
  const signals = parseMoodText("heartbroken, raining, wreck me gently under city neon");

  assert.equal(signals.hasText, true);
  assert.ok(signals.moods.includes("Heartbroken"));
  assert.ok(signals.weathers.includes("Raining"));
  assert.ok(signals.weathers.includes("Neon city"));
  assert.equal(signals.need, "Destroy me gently");
  assert.ok(signals.tokens.includes("heartbroken"));
});

test("free-text scorer rewards catalog metadata matches", () => {
  const moonlight = films.find((film) => film.title === "Moonlight");
  const madMax = films.find((film) => film.title === "Mad Max: Fury Road");
  const lonelyRain = parseMoodText("lonely raining tender quiet apartment comfort");

  assert.ok(scoreFreeText(moonlight, lonelyRain).score > scoreFreeText(madMax, lonelyRain).score);
  assert.ok(scoreFreeText(moonlight, lonelyRain).reasons.length >= 1);
});

test("rental bag ids persist and hydrate without duplicates or missing films", () => {
  const selected = [films[0], films[1], films[0]];
  const serialized = serializeRentalBagIds(selected);
  const hydrated = hydrateRentalBagFromIds([films[0].id, films[1].id, films[0].id, 9999], films);

  assert.equal(serialized, JSON.stringify([films[0].id, films[1].id, films[0].id]));
  assert.deepEqual(hydrated.map((film) => film.id), [films[0].id, films[1].id]);
});

test("trailer helpers resolve films and build autoplay embed URLs", () => {
  const film = resolveTrailerFilmById(films, films[0].id);
  const src = buildTrailerEmbedSrc(film.trailer);

  assert.equal(film.id, films[0].id);
  assert.ok(src.startsWith("https://www.youtube.com/embed/"));
  assert.ok(src.includes("autoplay=1"));
  assert.ok(src.includes("playsinline=1"));
});
