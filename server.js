const app = require('./app');
const Product = require('./models/Product');
const { fetchExternalProducts } = require('./services/productSeedService');

const PORT = process.env.PORT || 3000;

const seedOnStartup = async () => {
  const stats = Product.stats();

  if (stats.total_products > 0) {
    return { skipped: true, count: stats.total_products };
  }

  const { source, products } = await fetchExternalProducts();
  products.forEach((product) => Product.upsertExternal(product, source));
  return { skipped: false, source, count: products.length };
};

const startServer = async () => {
  const seedResult = await seedOnStartup();
  const message = seedResult.skipped
    ? `Database already contains ${seedResult.count} products`
    : `Seeded ${seedResult.count} products from ${seedResult.source}`;

  app.listen(PORT, () => {
    console.log(message);
    console.log(`MarketFlow Product API running on http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = { app, seedOnStartup };
