# Blockbuster+ React Frontend Design

Submitted by Joshua Ojeda

## Requirements Gathered

- Build a functional React SPA with Vite.
- Register it as an npm workspace in the primary repository.
- Include at least three navigable React Router routes.
- Demonstrate `useState`, `useEffect`, Context, and reusable components.
- Fetch and display data dynamically.
- Use an external UI component library.
- Preserve planning evidence and prepare a 5-10 minute presentation.
- Extend the same product with the Mini Project 3 MVC, database, and CRUD requirements.

## Scope

Blockbuster+ lets a user browse a film catalog, inspect details, save a rental bag, leave a local shelf note, and manage database records. The app is focused enough to present clearly while demonstrating a complete frontend-to-database path.

## Data Source

An empty database is populated from the Studio Ghibli API and the curated Blockbuster+ JSON catalog. The React app uses Axios to fetch the normalized records from `/api/v1/films`.

Core fields include `id`, `slug`, `title`, `genre`, `director`, `year`, `rating`, `runtime`, `description`, `poster`, `banner`, source metadata, tags, and reviews.

## Routes

- `/` - Dashboard summary and featured films
- `/films` - URL-backed search, genre filtering, and immutable sorting
- `/films/:filmId` - Dynamic film details and controlled review form
- `/rentals` - Context-powered rental bag persisted in localStorage
- `/catalog-manager` - Controlled create/edit form and confirmed deletion
- `/about` - Architecture and presentation summary

## Component Hierarchy

```text
AppProvider
  App
    Layout
      navigation + rental badge
      routed Outlet
        DashboardPage
          StatCard + FilmGrid + FilmCard
        FilmsPage
          FilmControls + FilmGrid + FilmCard
        FilmDetailPage
          FilmReviewForm
        RentalBagPage
        CatalogManagerPage
        AboutPage
```

## State Plan

- `useFilms` and `useFilm`: Axios lifecycle, loading, error, retry, cancellation
- `AppContext`: immutable rental ID list, derived count, toggle, clear, localStorage
- Films route: URL-backed search, genre, and sort settings
- Film detail: controlled rating and note persisted locally
- Catalog manager: controlled form values, edit mode, API feedback, delete confirmation
- `useMemo`: genres, ratings, filtered lists, sorted records, and summaries

## UI Direction

- Dark video-store palette with Blockbuster blue and yellow accents
- MUI layout, cards, dialogs, inputs, buttons, ratings, chips, and alerts
- Real film posters and banners from the catalog
- Compact responsive navigation and stable card dimensions
- Visible focus states, semantic labels, keyboard controls, and reduced-motion support
- Explicit loading, retry, empty, success, and destructive confirmation states

## Wireframes

Each route is documented separately in [`react-wireframes/`](react-wireframes/README.md) so a reviewer can compare planning to implementation without scanning one oversized board.

## Presentation Outline

1. Process: requirements, domain decision, route map, and wireframes.
2. Overview: one Blockbuster+ app combining both project milestones.
3. Data: external startup import, normalized SQLite schema, API, and Axios hook.
4. Interaction: filter, route, rent, review, and CRUD workflows.
5. Architecture: component hierarchy plus Express MVC boundaries.
6. Hooks: state, effect, context, memoization, and custom hooks.
7. Tools: Vite, React Router, Material UI, Axios, Express, SQLite, Swagger.
8. Future: authentication, persisted user reviews, and role-based admin access.
