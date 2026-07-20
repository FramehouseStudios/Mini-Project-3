# Rental Bag Wireframe

Route: `/rentals`

Purpose: Demonstrate global Context state with films selected from independent routes.

```text
+----------------------------------------------------------------+
| Rental Bag                                      [Clear bag]     |
| Selected film IDs live in React Context and localStorage.       |
+----------------------------------------------------------------+
| [Rental count] [Total runtime] [Average rating]                 |
+----------------------------------------------------------------+
| Saved film row                                                  |
| Title, year, rating, runtime                   [Details] [Remove]|
| Saved film row                                                  |
| Title, year, rating, runtime                   [Details] [Remove]|
+----------------------------------------------------------------+
```

## Grading Signals

- Shared rental IDs come from `AppContext`.
- Immutable actions remove one item or clear the complete bag.
- Summary metrics derive from selected database records.
- State survives navigation and refresh.
