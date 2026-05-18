# Blockbuster+ — Data Schema (audit + proposed normalized model)

> Backend-ready reference only. The current app is **frontend-only** and reads
> `data/films.json` directly. Nothing here changes the running site. Treat this
> as the contract a future backend should serve and that `scripts/validate-films.mjs`
> enforces today.

## 1. Current state (audited from `data/films.json`)

- 16 film records, ids `1..16` (unique, contiguous).
- Every record has the same 23 keys (no missing/optional drift today).
- `review` is a single object that duplicates `reviews[0]` in practice
  (denormalized "featured review").
- `genre`, `moods`, `weatherTags` are **controlled vocabularies** that the
  recommendation engine in `js/home.js` matches by exact string — renaming a
  value silently breaks recommendations.
- All `poster` values are `https://image.tmdb.org/t/p/w500/...`.

Observed ranges: `year 1980..2022`, `rating 7.3..9`, `runtime 104..164`,
`rewatches 7110..19120`, `lateNightScore 84..98`, `reviews` length always 3,
`stars` 4..5 in 0.5 steps.

## 2. Controlled vocabularies (authoritative)

| Vocab | Values |
| --- | --- |
| `genre` | `Action`, `Drama`, `Horror`, `Sci-Fi`, `Romance`, `Animation` |
| `moods` | `Angry`, `Burned out`, `Dissociated`, `Dreamy`, `Euphoric`, `Heartbroken`, `Hopeful`, `Inspired`, `Lonely`, `Nostalgic`, `Numb`, `Romantic` |
| `weatherTags` | `Clear night`, `Foggy`, `Neon city`, `Overcast`, `Raining`, `Snowing`, `Summer heat`, `Sunrise`, `Thunderstorm`, `Windy` |

`vibeTags` and `cultureTags` are **free-form display tags** (no fixed vocab) —
validated for shape only, not membership.

## 3. Film record — field contract

| Field | Type | Required | Constraint |
| --- | --- | --- | --- |
| `id` | integer | yes | ≥ 1, unique across file |
| `title` | string | yes | non-empty |
| `genre` | string (enum) | yes | ∈ `genre` vocab |
| `director` | string | yes | non-empty |
| `year` | integer | yes | 1900 ≤ year ≤ currentYear + 2 |
| `rating` | number | yes | 0 ≤ rating ≤ 10 |
| `runtime` | integer | yes | 1 ≤ runtime ≤ 1000 (minutes) |
| `rewatches` | integer | yes | ≥ 0 |
| `lateNightScore` | integer | yes | 0 ≤ score ≤ 100 |
| `favoriteScene` | string | yes | non-empty |
| `description` | string | yes | non-empty |
| `poster` | string (URL) | yes | `https://` URL; host SHOULD be `image.tmdb.org` |
| `vibeTags` | string[] | yes | each non-empty string |
| `cultureTags` | string[] | yes | each non-empty string |
| `moods` | string[] (enum) | yes | non-empty; each ∈ `moods` vocab |
| `weatherTags` | string[] (enum) | yes | non-empty; each ∈ `weatherTags` vocab |
| `soundtrack` | string | yes | non-empty |
| `drinkPairing` | string | yes | non-empty |
| `cinematicQuote` | string | yes | non-empty |
| `visualMood` | string | yes | non-empty |
| `emotionalSynopsis` | string | yes | non-empty |
| `review` | object (Review) | yes | featured review; see Review |
| `reviews` | Review[] | yes | length ≥ 1 |

### Review object

| Field | Type | Required | Constraint |
| --- | --- | --- | --- |
| `stars` | number | yes | 0 ≤ stars ≤ 5, multiple of 0.5 |
| `username` | string | yes | non-empty |
| `avatar` | string | yes | 1–4 chars (initials) |
| `quote` | string | yes | non-empty |

## 4. Proposed normalized model (for a real backend)

JSON-embedded arrays are fine for a static catalog. For a database-backed
backend, normalize to:

- **films** — scalar columns (id PK, title, genre, director, year, rating,
  runtime, rewatches, late_night_score, favorite_scene, description, poster).
- **reviews** — `id PK, film_id FK→films.id, stars, username, avatar, quote,
  is_featured bool`. Drops the denormalized top-level `review` (it becomes the
  row where `is_featured = true`).
- **recommendation_profile** — 1:1 with film (soundtrack, drink_pairing,
  cinematic_quote, visual_mood, emotional_synopsis), or a `jsonb` column on
  `films` if the backend is document-oriented.
- **tag membership** — `moods`, `weather_tags`, `vibe_tags`, `culture_tags`
  as join tables (`film_moods(film_id, mood)`), or `text[]`/`jsonb` columns.
  `genre`, `mood`, `weather_tag` should be enum/lookup tables seeded from §2.
- Add `schema_version` (start at `1`) and `slug` (derived from title+year,
  e.g. `the-dark-knight-2008`) so a future API can expose stable, shareable
  URLs without leaking integer ids.

The serialized `GET /films/:id` response can still **re-compose** the embedded
shape in §3 so the existing frontend keeps working unchanged (see
`docs/api-contracts.md`).

## 5. Frontend-safety note (do not break the current assignment)

Every key in §3 is consumed by `js/app.js` and/or `js/home.js`. **Do not rename
or drop keys in `data/films.json`** without updating those files in the same
change. The normalization in §4 is a *future backend* target, not a change to
the shipped JSON. Run `node scripts/validate-films.mjs` after any data edit.
