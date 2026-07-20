# Mini Project 3 Submission

Submitted by Joshua Ojeda

## Project

Blockbuster+ is a full-stack film discovery and rental-planning application. The browser experience, MVC API, external startup import, SQLite database, CRUD routes, test suite, Postman collection, and Swagger documentation all run from this repository.

## Grading Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| MVC architecture | Complete | `models/`, `controllers/`, `routes/`, HTML views |
| Startup external API import | Complete | `server.js`, `services/filmSeedService.js` |
| Database reflects API data | Complete | `config/database.js`, `docs/data-schema.md` |
| Create | Complete | `POST /api/v1/films` |
| Read | Complete | `GET /api/v1/films` and `GET /api/v1/films/:id` |
| Update | Complete | `PUT/PATCH /api/v1/films/:id` |
| Delete | Complete | `DELETE /api/v1/films/:id` |
| Postman demonstration | Complete | `docs/blockbuster-plus.postman_collection.json` |
| Swagger demonstration | Complete | `/api-docs` |
| Design evidence | Complete | `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md` |
| Mini Project 2 continuity | Complete | Merged Git history and runnable `previous-projects/mini-project-2-marketflow/` workspace |
| Automated verification | Complete | Zero-warning ESLint plus tests, data validation, and CSS checks through `npm run check` |

## Professor Review Path

```bash
npm install
npm start
```

1. Open <http://localhost:3000> to see the full application.
2. Open <http://localhost:3000/films> to confirm database-backed films render.
3. Open <http://localhost:3000/api-docs> for interactive CRUD documentation.
4. Import the Postman collection and run requests 1 through 9.
5. Run `npm run check` to verify tests, data, and CSS.
6. Review `docs/MINI_PROJECT_2_INTEGRATION.md`; the same check also lints and builds the included MarketFlow React workspace.

## Expected First-Run Evidence

With the external service available, startup reports:

```text
Database seeded with 16 curated and 22 external films
Blockbuster+ running at http://localhost:3000
Swagger documentation at http://localhost:3000/api-docs
```

One overlapping title is intentionally preserved as the curated version, resulting in 37 unique database records.
