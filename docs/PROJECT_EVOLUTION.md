# Project Evolution

## One Blockbuster+ Application

Mini Project 2 is no longer included as a separate application. Its strongest React implementation patterns have been adapted into Blockbuster+ and live at `apps/web`, the React/Vite workspace registered by the root `package.json`.

The repository still preserves Mini Project 2's authentic Git history, including its planning, feature, polish, and documentation branches merged through pull requests. The application source, however, now has one domain and one runtime.

Source history integrated from: <https://github.com/FramehouseStudios/Mini-Project-2>

## React Requirements Retained

- React 19 functional components
- Vite development and production builds
- React Router with six routes and a dynamic film route
- `useState`, `useEffect`, `useContext`, and `useMemo`
- Custom `useFilms` and `useFilm` hooks
- Material UI components and theme
- Axios request layer with loading, failure, retry, and cancellation behavior
- Search, filtering, immutable sorting, URL state, and reusable cards
- Controlled review and catalog-management forms
- Context and localStorage rental persistence
- Separate page wireframes and a component hierarchy

## Full-Stack Progression

| Earlier React milestone | Unified Mini Project 3 implementation |
| --- | --- |
| External catalog displayed in React | External film API imported at startup and displayed through the app API |
| Client-side product state | SQLite-backed film records plus Context-owned rental state |
| Product cards and detail routes | Film cards and `/films/:filmId` routes |
| Saved-product planner | Persistent Blockbuster+ rental bag |
| Frontend form interactions | Local review form plus database CRUD manager |
| Axios data hook | Axios film service backed by Express MVC endpoints |
| Vite-only start | Vite build served by Express as one deployable application |

## Runtime Model

```text
npm workspace: apps/web
    React Router + hooks + Context + MUI
                 |
               Axios
                 |
Express /api/v1/films -> Controller -> Film model -> SQLite
                 ^
        startup external API seed
```

## Verification

```bash
npm install
npm run check
npm start
```

The root quality gate verifies both the React milestone and the Mini Project 3 backend without running a second application.
