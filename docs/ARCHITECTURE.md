# Blockbuster+ Architecture

## MVC Responsibilities

### Model

`models/Film.js` owns validation, SQL queries, data mapping, filters, pagination, transactions, tags, and reviews. Controllers never contain SQL.

### View

`index.html`, `films.html`, and `about.html` are the views. Their browser scripts render the API's JSON response into the existing Blockbuster+ interface.

### Controller

`controllers/filmController.js` translates HTTP requests into model operations and returns a consistent JSON response envelope.

### Routes

`routes/filmRoutes.js` maps REST methods and paths to controller functions.

### Service

`services/filmSeedService.js` isolates the external Studio Ghibli request, source mapping, fallback behavior, and database seed process.

## Request Flow

```text
GET /films
  -> Express serves films.html
  -> js/blockbuster-api.js requests GET /api/v1/films
  -> routes/filmRoutes.js selects listFilms
  -> filmController.js calls Film.list
  -> Film model queries SQLite and composes tags/reviews
  -> Controller returns JSON
  -> Browser renders VHS cards, filters, and recommendations
```

## Startup Flow

```text
npm start
  -> server.js checks Film.stats()
  -> empty database triggers seedFilmDatabase()
  -> Studio Ghibli API is fetched
  -> external records are mapped to the film contract
  -> curated records and external records are upserted
  -> Express begins listening on port 3000
```

## Design Decisions

- The frontend and API share one origin, eliminating CORS configuration during local grading.
- SQLite keeps setup to one command and creates a real relational database file.
- Tags and reviews use related tables instead of duplicated JSON fields.
- External metadata arrays are retained as JSON because the UI does not query those relationships.
- The browser client falls back to `data/films.json` so the visual project remains resilient.
- Curated duplicate titles win over imported records to preserve the project's editorial voice.
