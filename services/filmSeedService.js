const fs = require('node:fs');
const path = require('node:path');
const Film = require('../models/Film');

const GHIBLI_API_URL = process.env.GHIBLI_API_URL || 'https://ghibliapi.vercel.app/films';
const curatedCatalogPath = path.join(__dirname, '..', 'data', 'films.json');

const moodPairs = [
  ['Dreamy', 'Hopeful'],
  ['Nostalgic', 'Inspired'],
  ['Euphoric', 'Romantic'],
  ['Lonely', 'Hopeful'],
  ['Dissociated', 'Dreamy'],
];
const weatherPairs = [
  ['Clear night', 'Windy'],
  ['Raining', 'Overcast'],
  ['Summer heat', 'Sunrise'],
  ['Foggy', 'Clear night'],
  ['Snowing', 'Overcast'],
];

function deriveGenre(film) {
  const description = String(film.description || '').toLowerCase();
  if (/war|death|survive|tragedy/.test(description)) return 'Drama';
  if (/witch|spirit|magic|curse|myth/.test(description)) return 'Fantasy';
  if (/journey|adventure|kingdom|pirate|rescue/.test(description)) return 'Adventure';
  return 'Animation';
}

function mapExternalFilm(film, index) {
  const rating = Math.min(10, Math.max(0, Number(film.rt_score || 0) / 10));
  const runtime = Math.max(1, Number(film.running_time || 1));
  const moodSet = moodPairs[index % moodPairs.length];
  const weatherSet = weatherPairs[index % weatherPairs.length];
  const initials = String(film.director || 'Studio Ghibli')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return {
    externalId: `ghibli:${film.id}`,
    title: film.title,
    originalTitle: film.original_title,
    originalTitleRomanised: film.original_title_romanised,
    genre: deriveGenre(film),
    director: film.director,
    producer: film.producer,
    year: Number(film.release_date),
    rating,
    runtime,
    rewatches: 2500 + Number(film.rt_score || 0) * 91 + index * 137,
    lateNightScore: Math.min(99, 68 + Math.round(rating * 3)),
    favoriteScene: `The moment ${film.title}'s world first opens up.`,
    description: film.description,
    poster: film.image,
    banner: film.movie_banner,
    trailer: '',
    vibeTags: [film.original_title_romanised, 'hand-drawn', 'studio ghibli'].filter(Boolean),
    cultureTags: ['international cinema', 'animation'],
    moods: moodSet,
    weatherTags: weatherSet,
    soundtrack: `A sweeping animated score selected for ${film.title}.`,
    drinkPairing: index % 2 === 0 ? 'Green tea' : 'Ramune soda',
    cinematicQuote: `A world worth rewinding: ${film.title}.`,
    visualMood: `${weatherSet[0].toLowerCase()}, painted skies, and hand-drawn wonder`,
    emotionalSynopsis: film.description,
    reviews: [
      {
        stars: Math.round((rating / 2) * 2) / 2,
        username: 'ghibli_clerk',
        avatar: initials || 'SG',
        quote: `${film.director}'s ${film.title} earns a permanent place on the staff shelf.`,
      },
    ],
    source: 'studio-ghibli-api',
    sourceUrl: film.url,
    people: film.people,
    species: film.species,
    locations: film.locations,
    vehicles: film.vehicles,
  };
}

function loadCuratedFilms() {
  const films = JSON.parse(fs.readFileSync(curatedCatalogPath, 'utf8'));
  return films.map((film) => ({
    ...film,
    externalId: `curated:${film.id}`,
    source: 'curated',
    sourceUrl: 'data/films.json',
  }));
}

async function fetchExternalFilms() {
  const response = await fetch(GHIBLI_API_URL, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`Studio Ghibli API responded with ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Studio Ghibli API returned an unexpected data shape');
  }

  return payload.map(mapExternalFilm);
}

async function seedFilmDatabase() {
  const curatedFilms = loadCuratedFilms();
  let externalFilms = [];
  let externalError = null;

  try {
    externalFilms = await fetchExternalFilms();
  } catch (error) {
    externalError = error.message;
  }

  curatedFilms.forEach((film) => Film.upsertSeed(film, { preserveId: true }));
  externalFilms.forEach((film) => Film.upsertSeed(film));

  return {
    curatedCount: curatedFilms.length,
    externalCount: externalFilms.length,
    externalSource: GHIBLI_API_URL,
    externalError,
    stats: Film.stats(),
  };
}

module.exports = {
  GHIBLI_API_URL,
  fetchExternalFilms,
  loadCuratedFilms,
  mapExternalFilm,
  seedFilmDatabase,
};
