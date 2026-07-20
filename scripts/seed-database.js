const { resetDatabase } = require('../config/database');
const { seedFilmDatabase } = require('../services/filmSeedService');

async function run() {
  resetDatabase();
  const result = await seedFilmDatabase();
  console.log(`Loaded ${result.curatedCount} curated films.`);
  console.log(`Fetched ${result.externalCount} films from ${result.externalSource}.`);
  if (result.externalError) {
    console.warn(`External seed warning: ${result.externalError}`);
  }
  console.log(result.stats);
}

run().catch((error) => {
  console.error('Database seed failed:', error);
  process.exitCode = 1;
});
