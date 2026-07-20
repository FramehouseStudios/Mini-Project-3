# Requirements and Design Notes

Submitted by Joshua Ojeda

## Application concept

MarketFlow Product API is a backend service for an ecommerce-style product catalog. It imports product data from the Fake Store API into a local SQLite database, then exposes CRUD endpoints that can be tested with Postman, Swagger-style documentation, or curl.

## User capabilities

A reviewer or backend user can:

- Seed the database from an external API on application startup.
- View all stored products.
- Filter products by category, price range, minimum rating, and search term.
- Sort products by title, price, rating, or newest record.
- View product categories and category counts.
- View summary stats for the database.
- Create a custom product.
- Read one product by id.
- Update a product.
- Delete a product.
- Reseed products from the external API on demand.

## External API

Source: Fake Store API

```text
https://fakestoreapi.com/products
```

The API returns ecommerce product objects with fields including:

- `id`
- `title`
- `price`
- `description`
- `category`
- `image`
- `rating.rate`
- `rating.count`

## Database structure

The SQLite table mirrors the external product data while adding backend metadata.

| Column | Purpose |
| --- | --- |
| `id` | Local database primary key |
| `external_id` | Original API product id |
| `title` | Product title |
| `price` | Product price |
| `description` | Product description |
| `category` | Product category |
| `image` | Product image URL |
| `rating_rate` | Average rating from external API |
| `rating_count` | Number of ratings from external API |
| `source` | External source or manual entry |
| `created_at` | Local creation timestamp |
| `updated_at` | Local update timestamp |

## MVC mapping

| MVC layer | Files | Responsibility |
| --- | --- | --- |
| Model | `models/Product.js` | SQL queries, validation, data mapping |
| View / Demo | `docs/API_REFERENCE.md`, Postman collection | Backend demonstration interface |
| Controller | `controllers/productController.js` | Request handling and response formatting |
| Routes | `routes/productRoutes.js` | REST endpoint definitions |
| Service | `services/productSeedService.js` | External API fetch and fallback data |

## Why a database helps

Using a database instead of reading directly from the external API gives the application:

- Faster repeat reads after startup seed.
- Full CRUD support for custom product edits.
- Filtering and sorting without depending on third-party API features.
- Resilience when the external API is offline.
- A stable data shape that the app controls.
