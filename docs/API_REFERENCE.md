# API Reference

Base URL: `http://localhost:3000`

## System

```http
GET /health
GET /api/v1
```

## Read

```http
GET /api/v1/films
GET /api/v1/films/:id
GET /api/v1/films/:slug
```

Example filter:

```text
/api/v1/films?genre=Drama&minRating=8&sort=year&order=desc&limit=10
```

## Create

```http
POST /api/v1/films
Content-Type: application/json
```

```json
{
  "title": "The Last Video Store",
  "genre": "Documentary",
  "director": "Joshua Ojeda",
  "year": 2026,
  "rating": 8.7,
  "runtime": 112,
  "description": "A documentary about the final neighborhood video store.",
  "moods": ["Nostalgic", "Hopeful"],
  "weatherTags": ["Raining"],
  "reviews": [
    {
      "stars": 4.5,
      "username": "night_clerk",
      "avatar": "NC",
      "quote": "Rewind this one."
    }
  ]
}
```

## Update

```http
PATCH /api/v1/films/:id
Content-Type: application/json
```

```json
{
  "rating": 9.1,
  "lateNightScore": 96
}
```

`PUT` is also supported at the same path.

## Delete

```http
DELETE /api/v1/films/:id
```

## Catalog Intelligence

```http
GET  /api/v1/films/genres
GET  /api/v1/films/stats
POST /api/v1/films/seed
```

The seed endpoint re-fetches the external service and upserts records without duplicating the catalog.
