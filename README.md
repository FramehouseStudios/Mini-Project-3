# Blockbuster+

Blockbuster+ is a modern reimagining of the classic video rental store. It combines Blockbuster nostalgia with modern streaming design and interactive VHS-style movie browsing.

## Purpose

The purpose of this app is to create a more curated and tactile movie discovery experience for film lovers who miss physical media and video store culture.

## Features

- Three-page website
- Responsive navigation
- Semantic HTML structure
- Bootstrap layout and buttons
- Local JSON movie data
- Fetch API
- Dynamic movie cards
- Search by title
- Filter by genre
- Interactive rental bag system
- VHS-inspired styling
- Letterboxd-style review elements

## Technologies Used

- HTML
- CSS
- JavaScript
- Fetch API
- Bootstrap
- Git
- GitHub

## Setup Instructions

1. Clone the repository.
2. Open the project in VS Code.
3. Use Live Server to open `index.html`.
4. Navigate through the app using the navbar.

## Contributor

Created by Joshua Ojeda.

## Future Improvements

- Add a real movie API
- Save rental bag items with localStorage
- Add user reviews
- Add trailers
- Deploy with GitHub Pages

## Backend Integration (future)

The app is intentionally frontend-only for this assignment, but the data layer
is documented and validated so a backend can be added later **without changing
any HTML/CSS**:

- **`docs/data-schema.md`** — audited field contract for `data/films.json`,
  the controlled vocabularies (genre / moods / weather), and a proposed
  normalized model for a real database.
- **`docs/api-contracts.md`** — request/response contracts for a future API
  (`GET /films`, `GET /films/:id`, `GET /reviews?filmId=`, `POST /rental-bag`,
  `DELETE /rental-bag/:id`, `POST /midnight-recommendation`) plus the exact
  URL-only migration path for `js/app.js` / `js/home.js`.
- **`scripts/validate-films.mjs`** — zero-dependency catalog validator. Run it
  after any data edit and in CI:

  ```bash
  node scripts/validate-films.mjs              # offline structural check
  node scripts/validate-films.mjs --check-urls # also verifies poster URLs + trailer embeds
  ```

  Exit code `0` = valid, `1` = errors (with a per-field report).

## Logic Tests

Core frontend logic is covered with Node's built-in test runner:

```bash
node --test
```

The suite locks the natural-language mood parser/scorer, rental bag
persist/hydrate helpers, and trailer embed mapping so interaction logic can
change safely without silently breaking the presentation flow.

## Styles (`css/style.css` is generated)

`css/style.css` is a **build artifact** — do not edit it directly. The source
of truth is the ordered partials in **`css/src/`** (`01-base.css` …
`10-late-passes-responsive.css`), split by area so edits stay focused instead
of scrolling a 13k-line monolith.

```bash
node scripts/build-css.mjs           # rebuild css/style.css from css/src/*
node scripts/build-css.mjs --check   # CI: fail if style.css is out of date
```

Partials are concatenated in filename order with no separator, so the shipped
stylesheet is **byte-identical** to the old monolith (cascade/order unchanged —
zero visual change). `css/style.css` stays committed so the site still works
with no build step. Further breaking up the large `03-components-core.css`
should be done one component at a time, re-running the build and diffing the
output to keep it byte-stable.

### Auditing CSS size

```bash
node scripts/audit-css.mjs          # dead-rule + size summary (read-only)
node scripts/audit-css.mjs --list   # also print every dead-candidate selector
```

Conservative, zero-dependency, **read-only**. A rule is only reported dead when
*every* class/id base-name in its whole selector list appears nowhere in any
HTML/JS string (element/`*`/attribute selectors are never flagged), so anything
it lists is safe to delete. Reality check from this tool: the bulk of the
stylesheet is **live, referenced** CSS, not dead code (~0.6%) or duplication
(~1.7%). Meaningful size reduction therefore requires a deliberate,
browser-verified design-system consolidation (shared tokens/utilities for the
repeated gradient/shadow/glass recipes) done per partial with the byte-stable
build as the safety net — not a mechanical purge. Keep defensive utilities
(`.visually-hidden`, the `.col-*` grid shim) even if currently unreferenced.
