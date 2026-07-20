const { before, beforeEach, after, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const Film = require('../models/Film');
const { resetDatabase } = require('../config/database');
const { loadCuratedFilms, mapExternalFilm } = require('../services/filmSeedService');

let server;
let baseUrl;

function seedCuratedCatalog() {
  loadCuratedFilms().forEach((film) => Film.upsertSeed(film, { preserveId: true }));
}

before(() => {
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  resetDatabase();
  seedCuratedCatalog();
});

after(() => new Promise((resolve) => server.close(resolve)));

test('serves the Blockbuster+ view and reports MVC database health', async () => {
  const pageResponse = await fetch(`${baseUrl}/`);
  const page = await pageResponse.text();
  assert.equal(pageResponse.status, 200);
  assert.match(page, /Blockbuster\+/);

  const healthResponse = await fetch(`${baseUrl}/health`);
  const health = await healthResponse.json();
  assert.equal(health.success, true);
  assert.equal(health.architecture, 'MVC');
  assert.equal(health.database, 'SQLite');
  assert.equal(health.films, 16);
});

test('lists, searches, filters, sorts, and paginates films', async () => {
  const response = await fetch(
    `${baseUrl}/api/v1/films?genre=Drama&minRating=7&sort=year&order=desc&limit=3`,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.ok(payload.data.length <= 3);
  assert.ok(payload.data.every((film) => film.genre === 'Drama' && film.rating >= 7));
  assert.equal(payload.page.limit, 3);
  assert.ok(payload.page.total >= payload.data.length);
});

test('completes a full create, read, update, and delete workflow', async () => {
  const createResponse = await fetch(`${baseUrl}/api/v1/films`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'The Last Video Store',
      genre: 'Documentary',
      director: 'Joshua Ojeda',
      year: 2026,
      rating: 8.7,
      runtime: 112,
      description: 'A documentary about the final neighborhood video store.',
      moods: ['Nostalgic', 'Hopeful'],
      weatherTags: ['Raining'],
      reviews: [
        { stars: 4.5, username: 'night_clerk', avatar: 'NC', quote: 'Rewind this one.' },
      ],
    }),
  });
  const created = await createResponse.json();
  assert.equal(createResponse.status, 201);
  assert.equal(created.data.title, 'The Last Video Store');
  assert.deepEqual(created.data.moods, ['Nostalgic', 'Hopeful']);

  const readResponse = await fetch(`${baseUrl}/api/v1/films/${created.data.id}`);
  const read = await readResponse.json();
  assert.equal(read.data.director, 'Joshua Ojeda');

  const updateResponse = await fetch(`${baseUrl}/api/v1/films/${created.data.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 9.1, lateNightScore: 96 }),
  });
  const updated = await updateResponse.json();
  assert.equal(updated.data.rating, 9.1);
  assert.equal(updated.data.lateNightScore, 96);

  const deleteResponse = await fetch(`${baseUrl}/api/v1/films/${created.data.id}`, {
    method: 'DELETE',
  });
  assert.equal(deleteResponse.status, 200);

  const missingResponse = await fetch(`${baseUrl}/api/v1/films/${created.data.id}`);
  assert.equal(missingResponse.status, 404);
});

test('maps the external API structure into the database film contract', () => {
  const mapped = mapExternalFilm({
    id: 'external-1',
    title: 'External Film',
    original_title: 'Original',
    original_title_romanised: 'Original Romanised',
    image: 'https://example.com/poster.jpg',
    movie_banner: 'https://example.com/banner.jpg',
    description: 'A magical journey through a distant kingdom.',
    director: 'API Director',
    producer: 'API Producer',
    release_date: '2001',
    running_time: '101',
    rt_score: '94',
    people: ['person-url'],
    species: ['species-url'],
    locations: ['location-url'],
    vehicles: ['vehicle-url'],
    url: 'https://example.com/films/external-1',
  }, 0);

  assert.equal(mapped.externalId, 'ghibli:external-1');
  assert.equal(mapped.year, 2001);
  assert.equal(mapped.rating, 9.4);
  assert.equal(mapped.runtime, 101);
  assert.deepEqual(mapped.people, ['person-url']);
});
