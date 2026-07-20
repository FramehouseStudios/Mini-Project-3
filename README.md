# Blockbuster+

Submitted by Joshua Ojeda

Blockbuster+ is a full-stack reimagining of the neighborhood video store. It combines a polished, responsive film-discovery frontend with an Express MVC API, a normalized SQLite database, startup data from an external film API, and complete CRUD operations.

This repository is the unified submission for Mini Project 3 and continues the product developed in the earlier mini projects.

## Quick Start

Use Node.js 22.5 or newer. Node 24 is recommended.

```bash
npm install
npm start
```

Then open:

- Application: <http://localhost:3000>
- Film catalog: <http://localhost:3000/films>
- Swagger: <http://localhost:3000/api-docs>
- API health: <http://localhost:3000/health>

Use `npm start` for this version of the project. Live Server can still display the static fallback, but it does not run Express or SQLite.

## Assignment Requirements

| Requirement | Implementation |
| --- | --- |
| MVC architecture | `models/Film.js`, `controllers/filmController.js`, `routes/filmRoutes.js`, and the HTML views |
| External API startup routine | First launch fetches the keyless Studio Ghibli API |
| Matching database structure | Film source fields map to SQLite; tags and reviews are normalized into related tables |
| Complete CRUD | Create, read, update, and delete film endpoints |
| Postman or Swagger demonstration | Interactive Swagger UI plus an importable Postman collection |
| Planning and design evidence | Requirements, schema, API contract, architecture, and presentation documents |

## Data Flow

```text
Browser views
    -> js/blockbuster-api.js
    -> /api/v1/films
    -> routes/filmRoutes.js
    -> controllers/filmController.js
    -> models/Film.js
    -> SQLite
```

On the first launch, the server:

1. Checks whether the SQLite catalog is empty.
2. Fetches films from `https://ghibliapi.vercel.app/films`.
3. Loads the 16 original Blockbuster+ editorial selections.
4. Maps both sources into one database contract.
5. Preserves the curated version when the same title exists in both sources.

The normal first seed produces 37 unique films: 16 curated records and 21 non-duplicate external records. If the external service is temporarily unavailable, the original curated catalog keeps the application usable.

## API Highlights

```text
GET    /health
GET    /api/v1/films
GET    /api/v1/films/:id
POST   /api/v1/films
PUT    /api/v1/films/:id
PATCH  /api/v1/films/:id
DELETE /api/v1/films/:id
GET    /api/v1/films/genres
GET    /api/v1/films/stats
POST   /api/v1/films/seed
```

Filters include `q`, `genre`, `mood`, `minRating`, `year`, `source`, sorting, and pagination.

## Demonstration

Swagger works directly in the browser at <http://localhost:3000/api-docs>.

For Postman, import:

```text
docs/blockbuster-plus.postman_collection.json
```

Run its requests from top to bottom. The Create request saves its returned film ID automatically, so the Read, Update, and Delete requests operate on that same record.

## Quality Checks

```bash
npm run check
```

This command runs:

- ESLint across server, browser, script, and test code with zero warnings allowed
- Frontend logic tests
- API and full CRUD integration tests
- Film catalog validation
- Generated CSS synchronization checks

## Project Structure

```text
blockbuster-plus/
|-- app.js                         # Express app, views, middleware, API docs
|-- server.js                      # Startup seed and HTTP server
|-- config/database.js             # SQLite connection and schema
|-- models/Film.js                 # Database queries and domain mapping
|-- controllers/filmController.js  # Request and response logic
|-- routes/filmRoutes.js            # REST routes
|-- services/filmSeedService.js    # External API and curated seed mapping
|-- index.html                      # Home view
|-- films.html                      # Catalog view
|-- about.html                      # Project view
|-- js/blockbuster-api.js           # Shared browser API client and fallback
|-- data/films.json                 # Original curated fallback catalog
|-- docs/                           # Rubric, API, schema, and presentation docs
|-- test/                           # Unit and integration tests
`-- scripts/                        # Seed, validation, and CSS scripts
```

## Submission Helpers

- [Submission checklist](SUBMISSION.md)
- [Requirements and design](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database schema](docs/data-schema.md)
- [API reference](docs/API_REFERENCE.md)
- [Presentation script](docs/PRESENTATION_SCRIPT.md)
- [Postman collection](docs/blockbuster-plus.postman_collection.json)

## Main Technologies

- HTML, CSS, JavaScript, and Bootstrap conventions
- Node.js and Express 5
- SQLite through Node's built-in `node:sqlite`
- MVC architecture
- Fetch API and an external Studio Ghibli API
- Swagger UI and Postman
- Node's built-in test runner
