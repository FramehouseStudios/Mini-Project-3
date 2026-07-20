const assert = require('node:assert/strict');
const { before, test } = require('node:test');

let filterAndSortFilms;
let getActiveFilmFilters;
let summarizeFilms;

const films = [
  {
    id: 1,
    title: 'Moonlight',
    director: 'Barry Jenkins',
    description: 'A tender coming-of-age drama.',
    genre: 'Drama',
    year: 2016,
    rating: 9.4,
    runtime: 111,
    rewatches: 28,
    lateNightScore: 92,
  },
  {
    id: 2,
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    description: 'A kinetic desert chase.',
    genre: 'Action',
    year: 2015,
    rating: 8.7,
    runtime: 120,
    rewatches: 44,
    lateNightScore: 88,
  },
  {
    id: 3,
    title: 'Aftersun',
    director: 'Charlotte Wells',
    description: 'A quiet memory of a family holiday.',
    genre: 'Drama',
    year: 2022,
    rating: 9.1,
    runtime: 102,
    rewatches: 12,
    lateNightScore: 96,
  },
];

before(async () => {
  ({ filterAndSortFilms, getActiveFilmFilters, summarizeFilms } = await import(
    '../apps/web/src/lib/filmCatalog.js'
  ));
});

test('film filtering searches title, director, and synopsis', () => {
  assert.deepEqual(
    filterAndSortFilms(films, { query: 'jenkins' }).map((film) => film.id),
    [1],
  );
  assert.deepEqual(
    filterAndSortFilms(films, { query: 'desert' }).map((film) => film.id),
    [2],
  );
});

test('film filtering combines genre and sort without mutating source data', () => {
  const originalOrder = films.map((film) => film.id);
  const visibleFilms = filterAndSortFilms(films, {
    genre: 'Drama',
    sortMode: 'newest',
  });

  assert.deepEqual(visibleFilms.map((film) => film.id), [3, 1]);
  assert.deepEqual(films.map((film) => film.id), originalOrder);
  assert.notEqual(visibleFilms, films);
});

test('sort modes produce deterministic catalog order', () => {
  assert.deepEqual(
    filterAndSortFilms(films, { sortMode: 'title' }).map((film) => film.title),
    ['Aftersun', 'Mad Max: Fury Road', 'Moonlight'],
  );
  assert.deepEqual(
    filterAndSortFilms(films, { sortMode: 'runtime-short' }).map((film) => film.id),
    [3, 1, 2],
  );
  assert.deepEqual(
    filterAndSortFilms(films, { sortMode: 'rewatched' }).map((film) => film.id),
    [2, 1, 3],
  );
});

test('active filters and catalog summaries expose presentation-ready metadata', () => {
  assert.deepEqual(
    getActiveFilmFilters({ query: 'quiet', genre: 'Drama', sortMode: 'rating-high' }),
    ['Search: quiet', 'Aisle: Drama', 'Rating: high to low'],
  );
  assert.deepEqual(summarizeFilms([]), {
    averageRating: 0,
    totalRuntime: 0,
    topRating: 0,
  });
  assert.deepEqual(summarizeFilms(films), {
    averageRating: (9.4 + 8.7 + 9.1) / 3,
    totalRuntime: 333,
    topRating: 9.4,
  });
});
