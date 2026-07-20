# Catalog Manager Wireframe

Route: `/catalog-manager`

Purpose: Demonstrate complete Create, Read, Update, and Delete behavior through a controlled React form and the Express MVC API.

```text
+----------------------------------------------------------------+
| Catalog Manager                                                |
| Every action travels through Route -> Controller -> Model.      |
+----------------------------------------------------------------+
| Add / edit film                                                |
| [Title] [Genre] [Director]                                     |
| [Year] [Rating] [Runtime]                                      |
| [Description] [Poster URL]                         [Save]       |
+----------------------------------------------------------------+
| Database records                                               |
| Film metadata                                  [Edit] [Delete]  |
| Film metadata                                  [Edit] [Delete]  |
+----------------------------------------------------------------+
| Delete confirmation dialog                                     |
+----------------------------------------------------------------+
```

## Grading Signals

- Controlled fields and submit handling use `useState`.
- API errors and success messages are visible.
- Read records refresh after create, update, and delete.
- Deletion requires explicit confirmation.
- Server-side validation remains authoritative.
