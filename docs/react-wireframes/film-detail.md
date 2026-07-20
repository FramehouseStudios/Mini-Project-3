# Film Detail Wireframe

Route: `/films/:filmId`

Purpose: Demonstrate route parameters, a fetched record, Context actions, and controlled review state.

```text
+----------------------------------------------------------------+
| [Back to films]                                                |
+----------------------------------------------------------------+
| Film poster       | Genre / year / source                      |
|                   | Film title and director                    |
|                   | Rating, runtime, rewatches                 |
|                   | Description and mood tags                  |
|                   | [Add to rental bag]                        |
+----------------------------------------------------------------+
| Leave a shelf note                                             |
| [Interactive rating] [Controlled review textarea] [Save]       |
| Success message after submit                                   |
+----------------------------------------------------------------+
```

## Grading Signals

- React Router `useParams` drives a dynamic API request.
- Context updates the rental bag without prop drilling.
- Review rating and note are controlled inputs.
- Local review state persists per film with `localStorage`.
