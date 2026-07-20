# Blockbuster+ Web Workspace

Submitted by Joshua Ojeda

This directory is the React 19 and Vite frontend for the primary Blockbuster+ Mini Project 3 application. It is registered by the root `package.json` as `@blockbuster-plus/web`; it is not a separate lab or standalone product.

## Workspace Commands

Run from the repository root:

```bash
npm run dev:web
npm run lint:web
npm run build:web
```

During development, run the Express API with `npm run dev` in a second terminal. Vite uses <http://localhost:5173> and proxies `/api` and `/health` to port 3000.

For the professor-facing production workflow, use `npm start` at the repository root. The root script builds this workspace and serves it through Express at <http://localhost:3000>.

## React Evidence

- Functional components and six React Router routes
- Dynamic `/films/:filmId` data route
- `useState`, `useEffect`, `useContext`, and `useMemo`
- Custom Axios-powered `useFilms` and `useFilm` hooks
- Material UI theme and responsive components
- Immutable sorting and Context updates
- URL-backed filters and localStorage persistence
- Controlled review and CRUD forms
- Loading, retry, empty, success, and confirmation states

Planning evidence lives in `../../docs/REACT_FRONTEND_DESIGN.md` and `../../docs/react-wireframes/`.
