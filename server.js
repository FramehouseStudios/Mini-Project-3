const app = require('./app');
const Film = require('./models/Film');
const { seedFilmDatabase } = require('./services/filmSeedService');

const PORT = Number(process.env.PORT || 3000);

async function seedOnStartup() {
  const stats = Film.stats();
  if (stats.total_films > 0) {
    return { skipped: true, stats };
  }

  return { skipped: false, ...(await seedFilmDatabase()) };
}

async function startServer() {
  const seedResult = await seedOnStartup();
  const message = seedResult.skipped
    ? `Database ready with ${seedResult.stats.total_films} films`
    : `Database seeded with ${seedResult.curatedCount} curated and ${seedResult.externalCount} external films`;

  if (seedResult.externalError) {
    console.warn(`External seed warning: ${seedResult.externalError}`);
  }

  const server = app.listen(PORT, () => {
    console.log(message);
    console.log(`Blockbuster+ running at http://localhost:${PORT}`);
    console.log(`Swagger documentation at http://localhost:${PORT}/api-docs`);
  });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start Blockbuster+:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, seedOnStartup, startServer };
