# 5-10 Minute Presentation Script

## 1. Introduction

"Blockbuster+ is a continuation of my earlier frontend projects. For Mini Project 3, I turned it into one full-stack application with an MVC API and relational database instead of creating an unrelated backend."

Open <http://localhost:3000> and briefly show the home page and film catalog.

## 2. Requirements and Design

"I began by documenting user capabilities, technical requirements, the database model, and API contract. I kept the existing browser experience as the View and designed the backend around films, tags, and reviews."

Show `docs/REQUIREMENTS.md` and `docs/ARCHITECTURE.md`.

## 3. External Data and Startup

"On an empty database, `server.js` calls the seed service. It fetches the keyless Studio Ghibli API, maps its film structure, combines it with my original curated catalog, and inserts unique records into SQLite."

Show `server.js` and `services/filmSeedService.js`. Mention that the normal seed creates 37 unique films.

## 4. Database Structure

"The `films` table reflects external fields such as title, original title, director, producer, year, runtime, score, images, URL, and related metadata. I normalized moods and other tags into `film_tags`, and reviews into a separate one-to-many table."

Show `config/database.js` and `docs/data-schema.md`.

## 5. MVC Structure

"Routes select a controller function, controllers handle HTTP responses, and the Film model owns validation and SQL. The seed service owns external integration. The HTML pages are the View."

Show the `models`, `controllers`, `routes`, and `services` directories.

## 6. CRUD Demonstration

Open <http://localhost:3000/api-docs> or import the Postman collection.

1. Run the health check.
2. Read the catalog.
3. Create `The Last Video Store`.
4. Read the returned ID.
5. Update its rating.
6. Delete it.
7. Show catalog statistics.

"The Postman collection automatically remembers the created ID so the demonstration is repeatable."

## 7. Why Use a Database?

"The database gives the app a stable local source, supports edits the external API cannot store, allows filtering and relationships, prevents duplicates, and keeps the curated catalog usable if the external service is unavailable."

## 8. Quality and Future Work

"I added unit and integration tests, validation, a JSON fallback, database constraints, Swagger, and presentation documentation. Next I would add authentication, per-user rental bags, and a review form that writes to the API."

Run:

```bash
npm run check
```

Finish by showing all checks passing.
