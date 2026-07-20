# API Reference

Base URL:

```text
http://localhost:3000
```

## Health

```http
GET /health
```

Returns the service status, database choice, and architecture.

## List products

```http
GET /api/products
```

Optional query params:

| Param | Example | Purpose |
| --- | --- | --- |
| `category` | `electronics` | Filter by exact category |
| `search` | `jacket` | Search title and description |
| `minPrice` | `25` | Minimum price |
| `maxPrice` | `150` | Maximum price |
| `minRating` | `4` | Minimum rating |
| `sort` | `rating-high` | Sort mode |

Sort modes:

- `title`
- `price-low`
- `price-high`
- `rating-high`
- `newest`

Example:

```bash
curl "http://localhost:3000/api/products?minRating=4&sort=rating-high"
```

## Get one product

```http
GET /api/products/:id
```

## Create product

```http
POST /api/products
Content-Type: application/json
```

```json
{
  "title": "Studio Tote Bag",
  "price": 36,
  "description": "A clean tote bag added through the local API.",
  "category": "accessories",
  "image": "https://example.com/tote.jpg",
  "rating": {
    "rate": 4.6,
    "count": 12
  }
}
```

## Update product

```http
PUT /api/products/:id
Content-Type: application/json
```

```json
{
  "price": 40,
  "rating": {
    "rate": 4.8,
    "count": 20
  }
}
```

## Delete product

```http
DELETE /api/products/:id
```

## Categories

```http
GET /api/products/categories
```

Returns each category, product count, and average price.

## Stats

```http
GET /api/products/stats
```

Returns product count, category count, average price, average rating, and last update time.

## Reseed

```http
POST /api/products/seed
```

Fetches the external API again and upserts products by `external_id`.
