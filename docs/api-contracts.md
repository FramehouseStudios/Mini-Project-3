# Blockbuster+ — API Contracts (future backend)

> Design target only. The app today is **frontend-only** (`fetch("data/films.json")`
> + `localStorage`). These contracts are shaped so a backend can be added later by
> changing **URLs only** — no UI/markup changes. Field shapes follow
> `docs/data-schema.md`.

## Conventions

- Base URL: `/api/v1`
- `Content-Type: application/json; charset=utf-8`
- All times ISO-8601 UTC. All ids are integers (see schema §4 for a future `slug`).
- **Success**: `2xx` with the resource body (or `{ "data": ... }` for collections).
- **Error envelope** (every non-2xx):

  ```json
  { "error": { "code": "NOT_FOUND", "message": "Film 999 does not exist" } }
  ```

  Codes: `BAD_REQUEST` (400), `NOT_FOUND` (404), `CONFLICT` (409),
  `RATE_LIMITED` (429), `INTERNAL` (500).
- Auth: none for V1. Reserve `Authorization: Bearer <token>` + a `sessionId`
  cookie for when the rental bag becomes per-user; until then the bag is keyed
  by an opaque `sessionId` the client already holds.
- Collection pagination: `?limit` (default 24, max 100) + `?offset` (default 0);
  responses include `page: { limit, offset, total }`.

---

## 1. `GET /films`

List/browse the catalog. Powers the films grid and home shelves.

Query params (all optional):

| Param | Type | Notes |
| --- | --- | --- |
| `q` | string | case-insensitive title substring |
| `genre` | enum | one of the `genre` vocab (schema §2) |
| `mood` | enum | one of the `moods` vocab |
| `sort` | enum | `rating` (default), `year`, `rewatches`, `title` |
| `order` | enum | `desc` (default), `asc` |
| `limit` / `offset` | int | pagination |

`200`:

```json
{
  "data": [ /* Film objects, embedded shape per schema §3 */ ],
  "page": { "limit": 24, "offset": 0, "total": 16 }
}
```

`400` if `genre`/`mood`/`sort` is outside its vocabulary.

> **Frontend migration:** returning a bare `Film[]` is also acceptable for a
> drop-in replacement of `data/films.json`; prefer the `{ data, page }` form for
> new clients. `js/app.js` / `js/home.js` consume the embedded Film shape as-is.

## 2. `GET /films/:id`

Single film, recomposed into the embedded shape (including `review` and
`reviews`) so the existing frontend renders unchanged.

- `200`: one Film object (schema §3).
- `404`: unknown id.
- `400`: non-integer id.

## 3. `GET /reviews?filmId=<id>`

Reviews for one film (the normalized `reviews` table, schema §4).

- `200`:

  ```json
  {
    "filmId": 1,
    "featured": { "stars": 4.5, "username": "filmnerd99", "avatar": "FN", "quote": "…" },
    "data": [ { "stars": 4.5, "username": "filmnerd99", "avatar": "FN", "quote": "…" } ]
  }
  ```

  `featured` mirrors today's denormalized `review` (the `is_featured` row).
- `400`: missing/non-integer `filmId`.
- `404`: `filmId` valid but no such film.

## 4. `POST /rental-bag`

Add a film to the session's rental bag. Mirrors the current localStorage
contract (`blockbusterRentalBag` = array of film ids), so `js/app.js`
persistence can move server-side with no UI change.

Request:

```json
{ "filmId": 1 }
```

- `200` (idempotent — adding an already-bagged film is a no-op success):

  ```json
  { "bag": [1, 5, 8], "added": 1 }
  ```

- `400`: missing/non-integer `filmId`.
- `404`: `filmId` is not a real film.

## 5. `DELETE /rental-bag/:id`

Remove a film from the session bag.

- `200`: `{ "bag": [5, 8], "removed": 1 }`
- `400`: non-integer id.
- `404`: id not currently in the bag.

> `GET /rental-bag` (list) and `DELETE /rental-bag` (clear) are natural
> companions; not required by the current UI but recommended for parity with
> the local bag lifecycle.

## 6. `POST /midnight-recommendation`

Server-side equivalent of the `js/home.js` "Ask the Night Clerk" engine.
Pure function of the request context + catalog (no persistence).

Request (mirrors the home form):

```json
{
  "time": "Midnight",
  "mood": "Dreamy",
  "weather": "Clear night",
  "need": "Comfort me",
  "intensity": 7,
  "excludeFilmId": 4
}
```

- `time` ∈ {Early Evening, 10 PM, Midnight, 2 AM, 4 AM, Sunrise}
- `mood` ∈ `moods` vocab; `weather` ∈ `weatherTags` vocab
- `need` ∈ {Comfort me, Destroy me gently, Wake me up, Make it weird, Give me hope, Let me spiral}
- `intensity` integer 1..10
- `excludeFilmId` optional — avoids repeating the last pick (the client already
  tracks `currentHomeMidnightFilm`).

`200`:

```json
{
  "film": { /* Film, embedded shape */ },
  "matchScore": 87,
  "reasons": ["matches the dreamy signal", "works with clear night outside"],
  "clerkNote": "Soft landing tape. …",
  "alternate": { /* Film or null */ }
}
```

- `400`: any enum/range violation in the body.

> Scoring should reproduce the weights in `getHomeMidnightRecommendation`
> (mood 46 / weather 34 / time 18 / need 28 / genre 16 / intensity + base
> `lateNightScore`). To keep results stable/testable server-side, make the
> random jitter optional via a `seed` field (default: small random as today).

---

## Frontend migration path (no UI redesign)

1. **Read path:** replace `fetch("data/films.json")` in `js/app.js` and
   `js/home.js` with `fetch("/api/v1/films")` (unwrap `.data` if the paged form
   is used). Embedded Film shape is unchanged → zero markup changes.
2. **Bag path:** behind the existing `persistRentalBag()` / `hydrateRentalBag()`
   seam in `js/app.js`, swap `localStorage` for `POST /rental-bag` /
   `DELETE /rental-bag/:id` / `GET /rental-bag`. The bag is still "an array of
   film ids", so button-state logic stays identical.
3. **Recommendation:** `handleHomeMidnightSubmit` posts the form context to
   `POST /midnight-recommendation` instead of computing locally; the render
   function already expects exactly this response object.

No framework is required: a small Node `http`/Express handler over the same
`films.json` (validated by `scripts/validate-films.mjs` in CI) satisfies every
contract above.
