const Product = require('../models/Product');
const { fetchExternalProducts } = require('../services/productSeedService');

const seed = async () => {
  const { source, products } = await fetchExternalProducts();
  products.forEach((product) => Product.upsertExternal(product, source));

  console.log(`Seeded ${products.length} products from ${source}.`);
  console.log(Product.stats());
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
