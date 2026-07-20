# Product Detail Wireframe

Route: `/products/:productId`

Purpose: Demonstrates dynamic routing, route params, fetched product lookup, save action, and controlled form state.

```text
+--------------------------------------------------------------+
| [Back to products]                                           |
+--------------------------------------------------------------+
| Product image       | Category chip                          |
|                     | Product title                          |
|                     | API rating and review count            |
|                     | Price                                  |
|                     | Description                            |
|                     | [Save to planner]                      |
+--------------------------------------------------------------+
| Leave your review                                           |
| Interactive star rating                                      |
| Review note textarea                                         |
| [Save review]                                                |
| Success message after submit                                 |
+--------------------------------------------------------------+
```

## Grading Signals

- Uses React Router `useParams`.
- Keeps API rating read-only and separate from user review state.
- Review form uses controlled input state and submit handling.
- Reviews persist locally per product with `localStorage`.

