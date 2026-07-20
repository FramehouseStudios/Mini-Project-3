const { db } = require('../config/database');

const mapProduct = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    externalId: row.external_id,
    title: row.title,
    price: row.price,
    description: row.description,
    category: row.category,
    image: row.image,
    rating: {
      rate: row.rating_rate,
      count: row.rating_count,
    },
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const normalizeProductInput = (input) => ({
  externalId: input.externalId ?? input.external_id ?? input.id ?? null,
  title: String(input.title || '').trim(),
  price: Number(input.price),
  description: String(input.description || '').trim(),
  category: String(input.category || '').trim(),
  image: input.image || '',
  ratingRate: Number(input.rating?.rate ?? input.ratingRate ?? input.rating_rate ?? 0),
  ratingCount: Number(input.rating?.count ?? input.ratingCount ?? input.rating_count ?? 0),
  source: input.source || 'manual',
});

const validateProduct = (product) => {
  if (!product.title) return 'Title is required';
  if (!Number.isFinite(product.price) || product.price < 0) return 'Price must be a positive number';
  if (!product.description) return 'Description is required';
  if (!product.category) return 'Category is required';
  if (!Number.isFinite(product.ratingRate) || product.ratingRate < 0 || product.ratingRate > 5) {
    return 'Rating must be between 0 and 5';
  }
  if (!Number.isInteger(product.ratingCount) || product.ratingCount < 0) {
    return 'Rating count must be a positive integer';
  }
  return null;
};

const buildListQuery = ({ category, search, minPrice, maxPrice, minRating, sort = 'title' }) => {
  const where = [];
  const params = {};

  if (category) {
    where.push('category = :category');
    params.category = category;
  }

  if (search) {
    where.push('(LOWER(title) LIKE :search OR LOWER(description) LIKE :search)');
    params.search = `%${String(search).toLowerCase()}%`;
  }

  if (minPrice !== undefined) {
    where.push('price >= :minPrice');
    params.minPrice = Number(minPrice);
  }

  if (maxPrice !== undefined) {
    where.push('price <= :maxPrice');
    params.maxPrice = Number(maxPrice);
  }

  if (minRating !== undefined) {
    where.push('rating_rate >= :minRating');
    params.minRating = Number(minRating);
  }

  const orderBy = {
    title: 'title COLLATE NOCASE ASC',
    'price-low': 'price ASC',
    'price-high': 'price DESC',
    'rating-high': 'rating_rate DESC, rating_count DESC',
    newest: 'created_at DESC',
  }[sort] || 'title COLLATE NOCASE ASC';

  return {
    sql: `SELECT * FROM products ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${orderBy}`,
    params,
  };
};

const Product = {
  list(filters = {}) {
    const { sql, params } = buildListQuery(filters);
    return db.prepare(sql).all(params).map(mapProduct);
  },

  findById(id) {
    return mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id)));
  },

  create(input) {
    const product = normalizeProductInput(input);
    const validationError = validateProduct(product);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    const result = db.prepare(`
      INSERT INTO products (
        external_id, title, price, description, category, image,
        rating_rate, rating_count, source, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      product.externalId,
      product.title,
      product.price,
      product.description,
      product.category,
      product.image,
      product.ratingRate,
      product.ratingCount,
      product.source,
    );

    return this.findById(result.lastInsertRowid);
  },

  upsertExternal(input, source = 'external-api') {
    const product = normalizeProductInput({ ...input, source });
    const validationError = validateProduct(product);

    if (validationError) {
      throw new Error(validationError);
    }

    db.prepare(`
      INSERT INTO products (
        external_id, title, price, description, category, image,
        rating_rate, rating_count, source, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(external_id) DO UPDATE SET
        title = excluded.title,
        price = excluded.price,
        description = excluded.description,
        category = excluded.category,
        image = excluded.image,
        rating_rate = excluded.rating_rate,
        rating_count = excluded.rating_count,
        source = excluded.source,
        updated_at = CURRENT_TIMESTAMP
    `).run(
      product.externalId,
      product.title,
      product.price,
      product.description,
      product.category,
      product.image,
      product.ratingRate,
      product.ratingCount,
      source,
    );
  },

  update(id, input) {
    const existing = this.findById(id);

    if (!existing) {
      return null;
    }

    const merged = normalizeProductInput({
      externalId: existing.externalId,
      title: input.title ?? existing.title,
      price: input.price ?? existing.price,
      description: input.description ?? existing.description,
      category: input.category ?? existing.category,
      image: input.image ?? existing.image,
      ratingRate: input.rating?.rate ?? input.ratingRate ?? existing.rating.rate,
      ratingCount: input.rating?.count ?? input.ratingCount ?? existing.rating.count,
      source: input.source ?? existing.source,
    });

    const validationError = validateProduct(merged);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    db.prepare(`
      UPDATE products
      SET title = ?, price = ?, description = ?, category = ?, image = ?,
          rating_rate = ?, rating_count = ?, source = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      merged.title,
      merged.price,
      merged.description,
      merged.category,
      merged.image,
      merged.ratingRate,
      merged.ratingCount,
      merged.source,
      Number(id),
    );

    return this.findById(id);
  },

  delete(id) {
    const existing = this.findById(id);

    if (!existing) {
      return null;
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(Number(id));
    return existing;
  },

  categories() {
    return db.prepare(`
      SELECT category, COUNT(*) AS count, ROUND(AVG(price), 2) AS average_price
      FROM products
      GROUP BY category
      ORDER BY category COLLATE NOCASE ASC
    `).all();
  },

  stats() {
    return db.prepare(`
      SELECT
        COUNT(*) AS total_products,
        COUNT(DISTINCT category) AS total_categories,
        ROUND(AVG(price), 2) AS average_price,
        ROUND(AVG(rating_rate), 2) AS average_rating,
        MAX(updated_at) AS last_updated
      FROM products
    `).get();
  },
};

module.exports = Product;
