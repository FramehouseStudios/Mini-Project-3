# Database Schema

Blockbuster+ uses SQLite and creates its schema automatically in `config/database.js`.

## External Source Mapping

The Studio Ghibli API returns fields such as:

| External field | Database/application field |
| --- | --- |
| `id` | `external_id` with a `ghibli:` prefix |
| `title` | `title` |
| `original_title` | `original_title` |
| `original_title_romanised` | `original_title_romanised` |
| `description` | `description` and `emotional_synopsis` |
| `director` | `director` |
| `producer` | `producer` |
| `release_date` | `year` |
| `running_time` | `runtime` |
| `rt_score` | `rating`, converted from 0-100 to 0-10 |
| `image` | `poster` |
| `movie_banner` | `banner` |
| `people`, `species`, `locations`, `vehicles` | JSON metadata columns |
| `url` | `source_url` |

The service adds Blockbuster+-specific editorial fields such as moods, weather tags, late-night score, and a clerk review.

## `films`

Stores scalar film and external-source fields:

- Primary key: `id`
- External identity: `external_id`, `source`, `source_url`
- Identity: `title`, `slug`, original-language titles
- Catalog: `genre`, `director`, `producer`, `year`, `rating`, `runtime`
- Editorial: rewatches, late-night score, favorite scene, descriptions, media, pairings
- External relationships: people, species, locations, and vehicles as JSON arrays
- Audit fields: `created_at`, `updated_at`

Important constraints include unique source IDs, unique slugs, unique title/year pairs, ratings between 0 and 10, positive runtime, and late-night scores between 0 and 100.

## `film_tags`

Normalizes the arrays consumed by the recommendation experience:

```text
film_id -> films.id
tag_type -> vibe | culture | mood | weather
value
sort_order
```

The composite primary key prevents duplicate tags for a film.

## `reviews`

Stores one-to-many review records:

```text
id
film_id -> films.id
stars
username
avatar
quote
is_featured
created_at
```

Deleting a film cascades to its tags and reviews. The model composes these related rows back into the embedded JSON shape expected by the frontend.
