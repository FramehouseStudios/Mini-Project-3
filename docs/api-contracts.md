# Implemented API Contract

Base URL: `/api/v1`

All responses use JSON. Successful responses contain `success: true` and `data`. Errors use:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Film not found"
  }
}
```

## Film Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/films` | List, filter, sort, and paginate |
| POST | `/films` | Create |
| GET | `/films/:id` | Read one by numeric ID or slug |
| PUT | `/films/:id` | Update |
| PATCH | `/films/:id` | Partial update |
| DELETE | `/films/:id` | Delete |
| GET | `/films/genres` | Genre counts and averages |
| GET | `/films/stats` | Database summary |
| POST | `/films/seed` | Fetch and upsert seed sources |

## List Query Parameters

- `q`: search title, director, and description
- `genre`: exact case-insensitive genre
- `mood`: exact mood tag
- `minRating`: minimum rating from 0 to 10
- `year`: exact release year
- `source`: `curated` or `studio-ghibli-api`
- `sort`: `rating`, `year`, `rewatches`, `title`, or `newest`
- `order`: `asc` or `desc`
- `limit`: 1-100
- `offset`: zero or greater

The complete executable contract is available in `docs/openapi.json` and rendered at `/api-docs`.
