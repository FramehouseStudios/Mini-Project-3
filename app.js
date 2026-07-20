const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    project: 'Mini Project 3: MarketFlow Product API',
    description: 'MVC backend API seeded from Fake Store API into SQLite.',
    docs: '/docs/API_REFERENCE.md',
    endpoints: {
      health: '/health',
      products: '/api/products',
      categories: '/api/products/categories',
      stats: '/api/products/stats',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'MarketFlow Product API',
    database: 'SQLite',
    architecture: 'MVC',
  });
});

app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

module.exports = app;
