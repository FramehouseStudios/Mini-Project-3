const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
const databasePath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(dataDir, 'marketflow.sqlite');

if (databasePath !== ':memory:') {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(databasePath);
db.exec('PRAGMA foreign_keys = ON;');

const initializeDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id INTEGER UNIQUE,
      title TEXT NOT NULL,
      price REAL NOT NULL CHECK (price >= 0),
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      rating_rate REAL DEFAULT 0 CHECK (rating_rate >= 0 AND rating_rate <= 5),
      rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating_rate DESC);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  `);
};

const resetDatabase = () => {
  db.exec('DROP TABLE IF EXISTS products;');
  initializeDatabase();
};

initializeDatabase();

module.exports = {
  db,
  initializeDatabase,
  resetDatabase,
};
