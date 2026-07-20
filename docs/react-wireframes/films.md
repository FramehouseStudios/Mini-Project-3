# Films Wireframe

Route: `/films`

Purpose: Demonstrate URL state, filtering, immutable sorting, list rendering, unique keys, and reusable film cards.

```text
+----------------------------------------------------------------+
| Films                                                          |
| Search the database-backed rental aisles.                       |
+----------------------------------------------------------------+
| [Search input] [Genre select] [Sort select]                     |
| Showing X of Y films                              [Reset]        |
| Active filter chips                                             |
+----------------------------------------------------------------+
| [Visible rentals] [Average rating] [Rental bag]                 |
+----------------------------------------------------------------+
| Film grid                                                       |
| [FilmCard] [FilmCard] [FilmCard]                                |
| [FilmCard] [FilmCard] [FilmCard]                                |
+----------------------------------------------------------------+
```

## Grading Signals

- React Router search parameters retain shareable filter state.
- `useMemo` derives visible films without mutating API data.
- Cards have stable database IDs as keys.
- Loading, error, retry, and empty states are explicit.
