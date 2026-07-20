# Mini Project 3 Submission

Submitted by Joshua Ojeda

## Project

MarketFlow Product API: a backend MVC application that seeds an SQLite database from Fake Store API and exposes RESTful CRUD endpoints.

## Requirements checklist

| Requirement | Completed |
| --- | --- |
| MVC architecture | Yes |
| External API startup data fetch | Yes |
| Database reflects external API data structure | Yes |
| CRUD operations | Yes |
| Backend demonstration through Postman/API docs | Yes |
| Design and requirements documentation | Yes |
| Presentation preparation | Yes |
| Automated tests | Yes |

## Key files

| File | Purpose |
| --- | --- |
| `server.js` | Startup routine and seed-on-start behavior |
| `app.js` | Express app and middleware |
| `config/database.js` | SQLite database setup and schema |
| `models/Product.js` | Product model and SQL operations |
| `controllers/productController.js` | Product request logic |
| `routes/productRoutes.js` | Product API routes |
| `services/productSeedService.js` | External API fetch and fallback seed data |
| `docs/REQUIREMENTS.md` | Planning and design evidence |
| `docs/API_REFERENCE.md` | API documentation |
| `docs/postman_collection.json` | Postman collection for demonstration |
| `docs/PRESENTATION_SCRIPT.md` | Presentation prep |

## How to run

```bash
npm install
npm start
```

The API starts at:

```text
http://localhost:3000
```

## How to test

```bash
npm test
```

## Demo endpoints

```text
GET    /health
GET    /api/products
GET    /api/products?minRating=4&sort=rating-high
GET    /api/products/categories
GET    /api/products/stats
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/seed
```
