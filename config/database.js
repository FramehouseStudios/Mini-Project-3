const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dataDirectory = path.join(__dirname, '..', 'data');
const databasePath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.resolve(process.env.DATABASE_PATH || path.join(dataDirectory, 'blockbuster.sqlite'));

if (databasePath !== ':memory:') {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

const db = new DatabaseSync(databasePath);
db.exec('PRAGMA foreign_keys = ON;');

if (databasePath !== ':memory:') {
  db.exec('PRAGMA journal_mode = WAL;');
}

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS films (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT UNIQUE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      original_title TEXT,
      original_title_romanised TEXT,
      genre TEXT NOT NULL,
      director TEXT NOT NULL,
      producer TEXT,
      year INTEGER NOT NULL CHECK (year >= 1888),
      rating REAL NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
      runtime INTEGER NOT NULL DEFAULT 1 CHECK (runtime > 0),
      rewatches INTEGER NOT NULL DEFAULT 0 CHECK (rewatches >= 0),
      late_night_score INTEGER NOT NULL DEFAULT 50 CHECK (late_night_score BETWEEN 0 AND 100),
      favorite_scene TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      poster TEXT NOT NULL DEFAULT '',
      banner TEXT NOT NULL DEFAULT '',
      trailer TEXT NOT NULL DEFAULT '',
      soundtrack TEXT NOT NULL DEFAULT '',
      drink_pairing TEXT NOT NULL DEFAULT '',
      cinematic_quote TEXT NOT NULL DEFAULT '',
      visual_mood TEXT NOT NULL DEFAULT '',
      emotional_synopsis TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'manual',
      source_url TEXT NOT NULL DEFAULT '',
      people_json TEXT NOT NULL DEFAULT '[]',
      species_json TEXT NOT NULL DEFAULT '[]',
      locations_json TEXT NOT NULL DEFAULT '[]',
      vehicles_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(title, year)
    );

    CREATE TABLE IF NOT EXISTS film_tags (
      film_id INTEGER NOT NULL,
      tag_type TEXT NOT NULL CHECK (tag_type IN ('vibe', 'culture', 'mood', 'weather')),
      value TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (film_id, tag_type, value),
      FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      film_id INTEGER NOT NULL,
      stars REAL NOT NULL CHECK (stars >= 0 AND stars <= 5),
      username TEXT NOT NULL,
      avatar TEXT NOT NULL,
      quote TEXT NOT NULL,
      is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_films_genre ON films(genre);
    CREATE INDEX IF NOT EXISTS idx_films_rating ON films(rating DESC);
    CREATE INDEX IF NOT EXISTS idx_films_year ON films(year DESC);
    CREATE INDEX IF NOT EXISTS idx_film_tags_lookup ON film_tags(tag_type, value);
    CREATE INDEX IF NOT EXISTS idx_reviews_film ON reviews(film_id);
  `);
}

function resetDatabase() {
  db.exec(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS film_tags;
    DROP TABLE IF EXISTS films;
  `);
  initializeDatabase();
}

initializeDatabase();

module.exports = {
  db,
  databasePath,
  initializeDatabase,
  resetDatabase,
};
