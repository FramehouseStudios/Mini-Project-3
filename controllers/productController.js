const Product = require('../models/Product');
const { fetchExternalProducts } = require('../services/productSeedService');

const ok = (res, data, status = 200, meta = {}) => {
  res.status(status).json({ success: true, ...meta, data });
};

const fail = (res, error, fallbackStatus = 500) => {
  const status = error.statusCode || fallbackStatus;
  res.status(status).json({ success: false, error: error.message });
};

const getProducts = (req, res) => {
  const products = Product.list(req.query);
  ok(res, products, 200, { count: products.length, filters: req.query });
};

const getProduct = (req, res) => {
  const product = Product.findById(req.params.id);

  if (!product) {
    return fail(res, new Error('Product not found'), 404);
  }

  ok(res, product);
};

const createProduct = (req, res) => {
  try {
    ok(res, Product.create(req.body), 201);
  } catch (error) {
    fail(res, error, 400);
  }
};

const updateProduct = (req, res) => {
  try {
    const product = Product.update(req.params.id, req.body);

    if (!product) {
      return fail(res, new Error('Product not found'), 404);
    }

    ok(res, product);
  } catch (error) {
    fail(res, error, 400);
  }
};

const deleteProduct = (req, res) => {
  const product = Product.delete(req.params.id);

  if (!product) {
    return fail(res, new Error('Product not found'), 404);
  }

  ok(res, product);
};

const getCategories = (_req, res) => {
  ok(res, Product.categories());
};

const getStats = (_req, res) => {
  ok(res, Product.stats());
};

const reseedProducts = async (_req, res) => {
  try {
    const { source, products } = await fetchExternalProducts();
    products.forEach((product) => Product.upsertExternal(product, source));
    ok(res, Product.stats(), 200, { message: `Seeded ${products.length} products from ${source}` });
  } catch (error) {
    fail(res, error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getStats,
  reseedProducts,
};
