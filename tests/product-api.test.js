const assert = require('node:assert/strict');
const test = require('node:test');
const app = require('../app');
const Product = require('../models/Product');
const { resetDatabase } = require('../config/database');
const { fallbackProducts } = require('../services/productSeedService');

const seedFallbackProducts = () => {
  resetDatabase();
  fallbackProducts.forEach((product) => Product.upsertExternal(product, 'Test seed'));
};

const request = async (path, options = {}) => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const body = await response.json();
    return { response, body };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

test('health endpoint reports MVC and SQLite', async () => {
  const { response, body } = await request('/health');

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.database, 'SQLite');
  assert.equal(body.architecture, 'MVC');
});

test('products can be listed, filtered, and sorted', async () => {
  seedFallbackProducts();

  const { response, body } = await request('/api/products?minRating=4&sort=rating-high');

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.count, 4);
  assert.ok(body.data[0].rating.rate >= body.data[1].rating.rate);
});

test('full CRUD flow works for products', async () => {
  seedFallbackProducts();

  const create = await request('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Studio Tote Bag',
      price: 36,
      description: 'A clean tote bag added through the local API.',
      category: 'accessories',
      image: 'https://example.com/tote.jpg',
      rating: { rate: 4.6, count: 12 },
    }),
  });

  assert.equal(create.response.status, 201);
  assert.equal(create.body.data.title, 'Studio Tote Bag');

  const productId = create.body.data.id;
  const read = await request(`/api/products/${productId}`);
  assert.equal(read.response.status, 200);
  assert.equal(read.body.data.category, 'accessories');

  const update = await request(`/api/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ price: 40, rating: { rate: 4.8, count: 20 } }),
  });

  assert.equal(update.response.status, 200);
  assert.equal(update.body.data.price, 40);
  assert.equal(update.body.data.rating.rate, 4.8);

  const deleted = await request(`/api/products/${productId}`, { method: 'DELETE' });
  assert.equal(deleted.response.status, 200);
  assert.equal(deleted.body.data.id, productId);

  const missing = await request(`/api/products/${productId}`);
  assert.equal(missing.response.status, 404);
});

test('categories and stats endpoints summarize database data', async () => {
  seedFallbackProducts();

  const categories = await request('/api/products/categories');
  assert.equal(categories.response.status, 200);
  assert.ok(categories.body.data.length >= 3);

  const stats = await request('/api/products/stats');
  assert.equal(stats.response.status, 200);
  assert.equal(stats.body.data.total_products, 4);
});
