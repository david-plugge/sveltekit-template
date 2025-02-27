import { privateEnv } from '$lib/env/env.private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export async function runDatabaseMigrations() {
	const migrationClient = postgres(privateEnv.DB_URL, { max: 1 });

	await migrate(drizzle(migrationClient), {
		migrationsFolder: './drizzle'
	});

	await migrationClient.end();
}
