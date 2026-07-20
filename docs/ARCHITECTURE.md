# Blockbuster+ Architecture

## MVC Responsibilities

### Model

`models/Film.js` owns validation, SQL queries, domain mapping, filters, pagination, transactions, tags, and reviews. Controllers contain no SQL.

### View

`apps/web` is the React/Vite view layer. Routed pages render the API's JSON responses with reusable Material UI components. Express serves the compiled SPA in production.

### Controller

`controllers/filmController.js` translates HTTP requests into model operations and returns a consistent JSON response envelope.

### Routes

`routes/filmRoutes.js` maps versioned REST methods and paths to controller functions.

### Service

`services/filmSeedService.js` isolates the external Studio Ghibli request, source mapping, offline fallback, and database seed process.

## Request Flow

```text
GET /films
  -> Express serves the compiled React entry point
  -> FilmsPage mounts
  -> useFilms useEffect calls the Axios film service
  -> GET /api/v1/films reaches filmRoutes
  -> filmController calls Film.list
  -> Film model queries SQLite and composes tags/reviews
  -> Controller returns the JSON response envelope
  -> React derives filters and renders keyed FilmCard components
```

## CRUD Flow

```text
CatalogManager controlled form
  -> Axios POST / PATCH / DELETE
  -> route
  -> controller
  -> Film model validation + transaction
  -> SQLite
  -> response feedback + catalog reload
```

Swagger and Postman call the same endpoints, proving CRUD does not depend on the React view.

## Startup Flow

```text
npm start
  -> prestart builds the apps/web Vite workspace
  -> server.js checks Film.stats()
  -> an empty database triggers seedFilmDatabase()
  -> the Studio Ghibli API is fetched
  -> external records map to the film contract
  -> curated and external records are upserted
  -> Express listens on port 3000 and serves the SPA + API
```

## Design Decisions

- One root npm workspace keeps the React frontend and Express backend in one install and quality gate.
- The frontend and API share one production origin, avoiding grading-time CORS setup.
- Vite proxies API requests to Express during hot-reload development.
- SQLite creates a real relational database with no separate service installation.
- Tags and reviews use related tables instead of duplicated list fields.
- External metadata arrays remain JSON because the current UI does not query those relationships.
- Curated data provides an offline seed fallback; imported data expands the catalog when the network is available.
- Curated duplicate titles win over imported records to preserve the project's editorial voice.
