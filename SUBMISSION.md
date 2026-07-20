# Mini Project 3 Submission

Submitted by Joshua Ojeda

## Project

Blockbuster+ is the single priority application for this submission. Mini Project 2's React/Vite implementation has been evolved into the frontend at `apps/web`; Mini Project 3 adds the MVC API, external startup seed, SQLite persistence, and complete CRUD behind that same interface.

## Grading Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| React/Vite workspace | Complete | Root `package.json` registers `apps/web` |
| React functional components and routing | Complete | Six routes in `apps/web/src/App.jsx` |
| React hooks and Context | Complete | `useFilms`, page state, `AppContext` |
| Material UI and Axios | Complete | Themed UI and `services/filmApi.js` |
| Design and wireframes | Complete | `docs/REACT_FRONTEND_DESIGN.md`, `docs/react-wireframes/` |
| MVC architecture | Complete | `models/`, `controllers/`, `routes/` |
| Startup external API import | Complete | `server.js`, `services/filmSeedService.js` |
| Database reflects source data | Complete | `config/database.js`, `docs/data-schema.md` |
| Create, read, update, delete | Complete | REST endpoints, API tests, and `/catalog-manager` |
| Postman demonstration | Complete | `docs/blockbuster-plus.postman_collection.json` |
| Swagger demonstration | Complete | `/api-docs` |
| Automated verification | Complete | `npm run check` |
| Mini Project 2 Git evidence | Complete | Earlier branches and merged pull requests remain in repository history |

## Professor Review Path

```bash
npm install
npm start
```

1. Open <http://localhost:3000> for the dashboard.
2. Open <http://localhost:3000/films> to search, filter, sort, and save films.
3. Open a film detail route to demonstrate dynamic routing and the controlled review form.
4. Open <http://localhost:3000/rentals> to demonstrate shared Context and localStorage.
5. Open <http://localhost:3000/catalog-manager> to create, edit, and delete a test film.
6. Open <http://localhost:3000/api-docs> to repeat CRUD without relying on the frontend.
7. Run `npm run check` for the complete automated quality gate.

## Expected First Run

With the external service available, startup reports the curated and external record counts. If it is offline, startup logs a warning and uses the curated catalog so the demonstration remains functional.
