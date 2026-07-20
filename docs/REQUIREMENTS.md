# Requirements and Design Record

## Product Goal

Deliver Blockbuster+ as one complete project that evolves the Mini Project 2 React application into the Mini Project 3 full-stack assignment. There is one user experience, one npm workspace tree, one API, and one database-backed film domain.

## Audience

- Film lovers looking for a focused alternative to algorithm-first streaming catalogs
- A professor reviewing React craft, planning evidence, MVC boundaries, relational data, CRUD, and presentation readiness

## User Capabilities

- Browse, search, filter, and sort a database-backed film catalog
- Open dynamic film-detail routes
- Add or remove films from a persistent rental bag
- Submit a controlled local review form
- Create, read, update, and delete catalog records through the UI
- Demonstrate the same CRUD operations through Swagger or Postman

## Functional Requirements

1. Register the Vite app as the root npm workspace at `apps/web`.
2. Use modern React functional components and React Router with at least three routes.
3. Demonstrate `useState`, `useEffect`, `useContext`, `useMemo`, a custom hook, controlled forms, and immutable updates.
4. Fetch records with Axios and render loading, error, empty, and success states.
5. Use Material UI for a responsive, accessible component system.
6. Serve the built React SPA through the Express application.
7. Use Model, Controller, and Route boundaries for film API behavior.
8. Create the normalized SQLite schema automatically.
9. Populate an empty database from an external API at startup, with a curated offline fallback.
10. Support complete film CRUD and predictable API responses.
11. Provide Swagger UI, a Postman collection, automated tests, and a clear review path.

## Non-Functional Requirements

- One-command production startup after dependency installation
- No API key or committed secret
- Responsive keyboard-accessible UI with visible focus states
- URL-backed catalog filters and resilient request states
- Request cancellation for unmounted React views
- Immutable Context and derived-list operations
- Database constraints for invalid years, ratings, runtimes, and relationships
- Safe duplicate handling during external refreshes
- Honest, concise documentation for grading and presentation

## Success Criteria

- `npm start` builds the Vite workspace and starts the complete application.
- The dashboard and film routes render records returned by `/api/v1/films`.
- Rental selections survive navigation and refresh.
- The Catalog Manager completes a create/read/update/delete cycle.
- Swagger and the Postman collection expose every required operation.
- A network failure during seed still leaves a usable curated catalog.
- `npm run check` exits successfully with no lint warnings or failing tests.

## Future Scope

- Authentication and per-user rentals
- Persisted review records submitted through the API
- Role-based access for catalog management
- Production database hosting and scheduled seed refreshes
