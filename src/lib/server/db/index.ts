import { privateEnv } from '$lib/env/private.server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { postsTable, usersTable } from './schema';

export const dbClient = postgres(privateEnv.DB_URL);

export const db = drizzle(dbClient, {
	schema: {
		users: usersTable,
		posts: postsTable
	}
});
