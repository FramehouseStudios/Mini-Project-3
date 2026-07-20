# Blockbuster+

Submitted by Joshua Ojeda

Blockbuster+ is one cohesive full-stack film discovery and rental-planning application. Mini Project 2's React/Vite work now powers the frontend of Mini Project 3 instead of living as a second lab. The same application combines React, routing, hooks, Context, Material UI, Axios, an Express MVC API, SQLite, startup data integration, and complete CRUD.

## Quick Start

Use Node.js 22.5 or newer. Node 24 is recommended.

```bash
npm install
npm start
```

`npm start` builds the registered React workspace and starts Express. Open:

- Application: <http://localhost:3000>
- Film catalog: <http://localhost:3000/films>
- UI CRUD manager: <http://localhost:3000/catalog-manager>
- Swagger: <http://localhost:3000/api-docs>
- API health: <http://localhost:3000/health>

Do not use Live Server for this project. Express must run so the React app can reach SQLite and the REST API.

## One Application, Two Milestones

The React/Vite application is registered in the root npm workspace at `apps/web`. It is not a separate earlier-project submission. The React concepts were retained and adapted to the Blockbuster+ film domain, while Mini Project 3 adds the database and API layers.

### Mini Project 2 React requirements

| Requirement | Blockbuster+ evidence |
| --- | --- |
| React application created with Vite | `apps/web/`, registered in root `workspaces` |
| Functional components | Reusable components and routed pages in `apps/web/src/` |
| At least three React Router routes | Dashboard, films, detail, rental bag, catalog manager, and about |
| `useState` | Filters, controlled reviews, catalog CRUD form, dialogs, and request state |
| `useEffect` | API requests, cancellation, and rental-bag persistence |
| UI component library | Material UI theme, layout, controls, cards, dialogs, and feedback |
| Fetched data displayed dynamically | Axios custom hook loads database records seeded from an external film API |
| Global state | Context shares immutable rental-bag state across routes |
| Custom hook | `useFilms` and `useFilm` encapsulate API lifecycle behavior |
| Dynamic routing | `/films/:filmId` loads a database-backed detail view |
| Form handling | Controlled review form and full catalog CRUD form |
| Design evidence | `docs/REACT_FRONTEND_DESIGN.md` and `docs/react-wireframes/` |
| Branches and pull requests | Preserved in the merged Mini Project 2 Git history |

### Mini Project 3 technical requirements

| Requirement | Blockbuster+ evidence |
| --- | --- |
| MVC architecture | `models/Film.js`, `controllers/filmController.js`, `routes/filmRoutes.js` |
| Startup external API routine | `server.js` and `services/filmSeedService.js` seed an empty database |
| Matching database structure | Source fields map to `films`; repeated tags and reviews use related tables |
| Create | `POST /api/v1/films` and the Catalog Manager |
| Read | `GET /api/v1/films` and `GET /api/v1/films/:identifier` |
| Update | `PUT/PATCH /api/v1/films/:id` and the Catalog Manager |
| Delete | `DELETE /api/v1/films/:id` and confirmed deletion in the Catalog Manager |
| Postman or Swagger demo | Interactive Swagger UI and importable Postman collection |

## Architecture

```text
React/Vite SPA (apps/web)
  -> Axios service + custom hooks
  -> /api/v1/films
  -> Express routes
  -> controller
  -> Film model
  -> normalized SQLite database
```

On an empty database, startup fetches `https://ghibliapi.vercel.app/films`, maps the returned film fields into the database contract, and combines them with the curated Blockbuster+ catalog. If the external service is unavailable, the curated records keep the application and grading workflow usable.

## API

```text
GET    /health
GET    /api/v1/films
GET    /api/v1/films/:identifier
POST   /api/v1/films
PUT    /api/v1/films/:id
PATCH  /api/v1/films/:id
DELETE /api/v1/films/:id
GET    /api/v1/films/genres
GET    /api/v1/films/stats
POST   /api/v1/films/seed
```

The list endpoint supports search, genre, mood, year, source, minimum rating, sorting, and pagination.

## Verification

```bash
npm run check
```

The quality gate runs root ESLint, React ESLint, the Vite production build, frontend logic tests, API integration tests including full CRUD, and catalog data validation.

For Postman, import `docs/blockbuster-plus.postman_collection.json` and run the requests in order. The create request stores its film ID for the subsequent read, update, and delete requests.

## Development

For Vite hot reload, use two terminals:

```bash
npm run dev
```

```bash
npm run dev:web
```

Open <http://localhost:5173>. Vite proxies `/api` and `/health` to Express on port 3000.

## Project Structure

```text
blockbuster-plus/
|-- apps/web/                      # React 19 + Vite npm workspace
|   `-- src/                       # Routes, components, hooks, Context, API client
|-- app.js                         # Express middleware, API, Swagger, SPA serving
|-- server.js                      # Startup seed and HTTP server
|-- config/database.js             # SQLite schema and connection
|-- models/Film.js                 # Data access, mapping, and validation
|-- controllers/filmController.js  # HTTP request/response logic
|-- routes/filmRoutes.js           # Versioned REST routes
|-- services/filmSeedService.js    # External API mapping and seed fallback
|-- data/films.json                # Curated fallback catalog
|-- docs/                          # Requirements, wireframes, schema, API, Postman
|-- test/                          # Frontend logic and API integration tests
`-- scripts/                       # Seed and data validation tools
```

## Review Documents

- [Submission checklist](SUBMISSION.md)
- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project evolution](docs/PROJECT_EVOLUTION.md)
- [React design plan](docs/REACT_FRONTEND_DESIGN.md)
- [React route wireframes](docs/react-wireframes/README.md)
- [Database schema](docs/data-schema.md)
- [API reference](docs/API_REFERENCE.md)
- [Presentation script](docs/PRESENTATION_SCRIPT.md)
- [Postman collection](docs/blockbuster-plus.postman_collection.json)

## Technology

- React 19, Vite, React Router, hooks, Context, Axios, and Material UI
- Node.js, Express 5, and MVC architecture
- SQLite through Node's built-in `node:sqlite`
- Studio Ghibli external API, Swagger UI, Postman, ESLint, and Node test runner
