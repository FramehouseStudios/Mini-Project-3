# Products Wireframe

Route: `/products`

Purpose: Main browsing experience. Demonstrates local state, filtering, sorting, list rendering, and reusable product cards.

```text
+--------------------------------------------------------------+
| Products                                                     |
| Search, filter, sort, and save products.                     |
+--------------------------------------------------------------+
| [Search input] [Category select] [Sort select]                |
| Showing X of Y products                         [Reset]       |
| Active filter chips                                          |
+--------------------------------------------------------------+
| [Visible results] [Average visible price] [Saved shortlist]   |
+--------------------------------------------------------------+
| Product grid                                                 |
| [ProductCard] [ProductCard] [ProductCard]                    |
| [ProductCard] [ProductCard] [ProductCard]                    |
+--------------------------------------------------------------+
```

## Grading Signals

- `useState` manages search, category, and sort mode.
- `useMemo` derives visible products without mutating source API data.
- Product cards use unique keys and reusable component structure.
- URL parameters can pre-load filtered or sorted views.

