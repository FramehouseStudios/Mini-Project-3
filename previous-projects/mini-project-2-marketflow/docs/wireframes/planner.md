# Planner Wireframe

Route: `/planner`

Purpose: Demonstrates global state with Context by showing products saved from other routes.

```text
+--------------------------------------------------------------+
| Planner                                      [Clear saved]    |
| Saved products live in React Context.                         |
+--------------------------------------------------------------+
| [Shortlist total] [Average rating] [Highest price]            |
+--------------------------------------------------------------+
| Saved shortlist summary                                      |
| Category chip                                                |
+--------------------------------------------------------------+
| Saved product row                                            |
| [Image] Title, chips, rating                 [Details] [Remove]|
| Saved product row                                            |
| [Image] Title, chips, rating                 [Details] [Remove]|
+--------------------------------------------------------------+
```

## Grading Signals

- Shared saved product IDs come from `AppContext`.
- User can remove one saved item or clear all saved items.
- Summary metrics are computed from saved products.
- State persists with `localStorage`.

