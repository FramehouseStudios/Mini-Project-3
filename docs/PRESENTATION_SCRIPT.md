# 5-10 Minute Presentation Script

## 1. Introduction

“Blockbuster+ is one full-stack application. I evolved my Mini Project 2 React/Vite work into the view layer for Mini Project 3, then added an Express MVC API and relational SQLite database behind it.”

Open <http://localhost:3000> and show the dashboard.

## 2. Requirements and Design

“I began with the assignment requirements, separated each route into its own wireframe, planned the React component hierarchy, and mapped the backend into Model, Controller, Route, and Service responsibilities.”

Show `docs/REQUIREMENTS.md`, `docs/REACT_FRONTEND_DESIGN.md`, and `docs/react-wireframes/README.md`.

## 3. React Application

Open Films, one Film Detail page, and Rental Bag.

“The Vite workspace is registered at `apps/web`. It uses functional components, React Router, Material UI, Axios, and hooks. `useFilms` owns the API lifecycle, URL search parameters retain catalog filters, and Context shares immutable rental IDs across routes and persists them in localStorage.”

Point out loading/retry behavior, unique card keys, the dynamic route, and the controlled shelf-note form.

## 4. External Data and Startup

“On an empty database, `server.js` calls the seed service. It fetches the keyless Studio Ghibli API, maps its response to my film contract, combines it with the curated Blockbuster+ catalog, and inserts unique records into SQLite. If the service is offline, the curated seed keeps the demo usable.”

Show `server.js` and `services/filmSeedService.js`.

## 5. Database and MVC

“The `films` table reflects the source fields. Repeated tags and reviews use related tables. Routes select controller functions, controllers manage HTTP responses, and the Film model owns validation, SQL, transactions, and mapping.”

Show `config/database.js`, `models/Film.js`, `controllers/filmController.js`, and `routes/filmRoutes.js`.

## 6. Complete CRUD

Open <http://localhost:3000/catalog-manager>.

1. Create a temporary film.
2. Find it in the records list.
3. Edit its rating or description.
4. Delete it and confirm the warning dialog.

“This controlled React form calls the same REST endpoints documented in Swagger, so the CRUD workflow is verifiable with or without the frontend.”

Then open <http://localhost:3000/api-docs> or import the Postman collection and briefly identify the POST, GET, PATCH, and DELETE operations.

## 7. Why Use a Database?

“SQLite gives the app a stable local source, supports edits an external API cannot retain, enables validation and relationships, prevents duplicates, and makes the project straightforward to run for grading.”

## 8. Quality and Future Work

Run:

```bash
npm run check
```

“The quality gate lints both layers, builds Vite, tests immutable frontend helpers, completes an API CRUD cycle, tests the offline seed fallback, and validates the curated catalog. Next I would add authentication, role-based catalog permissions, and persisted user reviews.”
