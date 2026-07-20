# Requirements and Design Record

## Product Goal

Continue the Blockbuster+ concept from earlier mini projects and turn it into one full-stack application that demonstrates Modules 8 and 9: relational data design, an MVC backend, external API integration, and REST API development.

## Audience

- Film lovers looking for a curated alternative to algorithm-first streaming services
- A professor reviewing frontend craft, database understanding, API structure, and presentation readiness

## User Capabilities

- Browse a database-backed film catalog
- Search and filter films by title and genre in the browser
- Receive mood-based recommendations
- Build and retain a rental bag in the browser
- Inspect individual film details and reviews
- Use the API to create, read, update, and delete film records
- Filter and paginate records from the API
- Refresh records from an external data source

## Functional Requirements

1. Serve all Blockbuster+ pages through one Express application.
2. Use MVC boundaries for film API behavior.
3. Create the SQLite database automatically.
4. On an empty database, fetch Studio Ghibli data before starting the server.
5. Preserve the original curated film catalog and use it as a network fallback.
6. Support full film CRUD and useful catalog queries.
7. Return predictable success and error responses.
8. Provide both Swagger UI and a Postman collection.
9. Include automated tests for browser logic and backend behavior.

## Non-Functional Requirements

- One-command local startup after dependency installation
- No required API key or committed secret
- Responsive and keyboard-accessible frontend behavior
- Immutable, testable browser helper logic
- Database constraints for invalid ratings, years, and runtimes
- Safe duplicate handling when external data is refreshed
- Clear grading and presentation documentation

## Success Criteria

- A fresh startup produces a usable database from the external API and curated catalog.
- The visual catalog renders records returned by `/api/v1/films`.
- Postman can run create, read, update, and delete sequentially.
- Swagger lists every required operation.
- `npm run check` exits successfully.

## Future Scope

- Authentication and per-user rental bags
- User-created reviews through the interface
- Production database deployment
- Admin editing interface
- Scheduled external data refreshes
