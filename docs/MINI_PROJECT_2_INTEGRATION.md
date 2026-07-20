# Mini Project 2 Integration

## Inclusion Status

Mini Project 2 is included in this Mini Project 3 submission in two verifiable ways:

1. Its complete Git history is merged into the Blockbuster+ repository lineage.
2. Its final React/Vite source and planning artifacts are preserved as the `mini-project-2-marketflow` npm workspace under `previous-projects/`.

Source repository: <https://github.com/FramehouseStudios/Mini-Project-2>

Integrated Mini Project 2 revision: `4affdb3` (`Separate wireframes by app page`)

The preserved workspace adds one integration-only change to that revision: Vite vendor chunking keeps its production build warning-free inside the unified quality gate. Application behavior and assignment features are unchanged.

## Why It Is Separate

MarketFlow and Blockbuster+ have different application entry points and dependency stacks. Nesting MarketFlow as a workspace keeps both assignments independently runnable and prevents its Vite `package.json` from conflicting with the Express/SQLite Mini Project 3 server.

- Blockbuster+ remains the primary application at <http://localhost:3000>.
- MarketFlow remains the previous React assignment and runs through Vite.
- The root quality gate verifies both projects.

## Mini Project 2 Evidence Preserved

- React 19 functional components
- React Router page navigation and dynamic product routes
- `useState`, `useEffect`, `useContext`, and a custom `useProducts` hook
- Material UI component library
- Axios integration with the Fake Store API
- Search, filtering, sorting, saved products, ratings, and local storage
- Separate dashboard, products, product-detail, planner, and about wireframes
- Design plan and presentation guidance

## Progression Into Mini Project 3

| Mini Project 2 concept | Mini Project 3 progression |
| --- | --- |
| External product API consumed in React | External film API imported through a server startup service |
| Client-side product state | Persistent normalized SQLite film data |
| React Router pages | Express-served application views plus REST routes |
| Reusable product cards and controls | Database-backed film cards, search, filters, and rental planning |
| Context and local storage | Server-owned catalog plus local rental-bag persistence |
| Frontend API error states | Predictable API error contracts and offline seed fallback |
| Vite lint and build checks | Unified lint, tests, data checks, CSS checks, and workspace build |

## Run And Verify

From the repository root:

```bash
npm install
npm run check
```

Run Blockbuster+:

```bash
npm start
```

Run the included Mini Project 2 application:

```bash
npm run dev --workspace mini-project-2-marketflow
```

This structure preserves the professor's ability to review each assignment separately while making their progression visible in one cohesive repository.
