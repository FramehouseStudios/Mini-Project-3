# Presentation Script

## 1. Requirements and design process

I chose Option 1 and continued the ecommerce/backend theme from previous projects. Before coding, I listed the user capabilities, picked a public API, mapped the returned data into a database table, and planned the MVC file structure.

## 2. Application overview

MarketFlow Product API is a backend-only product catalog. It imports products from Fake Store API, stores them in SQLite, and exposes REST endpoints for product CRUD, filters, categories, and stats.

## 3. Data source

The external source is Fake Store API at `https://fakestoreapi.com/products`. If that API is unavailable, the seed service uses local fallback data so the project still works during grading.

## 4. Startup database seed

When the server starts, `server.js` calls `seedOnStartup()`. If the database is empty, it fetches external products and stores them with `Product.upsertExternal()`.

## 5. Database structure

The SQLite table mirrors the API object: title, price, description, category, image, rating rate, and rating count. It also adds local metadata such as `source`, `created_at`, and `updated_at`.

## 6. MVC structure

Routes live in `routes/productRoutes.js`, controller logic lives in `controllers/productController.js`, and database logic lives in `models/Product.js`. The external API logic is isolated in `services/productSeedService.js`.

## 7. CRUD coverage

CRUD is covered by:

- Create: `POST /api/products`
- Read: `GET /api/products` and `GET /api/products/:id`
- Update: `PUT /api/products/:id`
- Delete: `DELETE /api/products/:id`

## 8. Why database instead of API directly

A database lets the app keep working if the external API is slow or down. It also allows local edits, faster queries, filtering, sorting, and a stable data model controlled by the application.

## 9. Future extensions

Future improvements could include authentication, product reviews, order planning, admin dashboards, Swagger UI, and deployment with a managed database.
