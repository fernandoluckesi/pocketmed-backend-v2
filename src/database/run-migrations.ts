/**
 * Standalone migration runner for production.
 * Used by start.sh to run migrations before the app starts.
 */
import 'reflect-metadata';
import AppDataSource from './data-source';

async function runMigrations() {
  console.log('Initializing data source...');
  await AppDataSource.initialize();

  console.log('Running pending migrations...');
  const migrations = await AppDataSource.runMigrations();

  if (migrations.length === 0) {
    console.log('No pending migrations.');
  } else {
    console.log(`Ran ${migrations.length} migration(s):`);
    migrations.forEach((m) => console.log(` - ${m.name}`));
  }

  await AppDataSource.destroy();
  console.log('Migrations complete.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
