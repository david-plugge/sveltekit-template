import { privateEnv } from '$lib/env/env.private';
import { PgTable } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const dbClient = postgres(privateEnv.DB_URL);

export const db = drizzle(dbClient, {
	schema: createSchema(schema)
});

function createSchema<Schema extends Record<string, unknown>>(schema: Schema) {
	const out: Record<string, PgTable> = {};

	for (const key in schema) {
		if (schema[key] instanceof PgTable) {
			out[key.replace(/Table$/, '')] = schema[key];
		}
	}

	return out as {
		[K in keyof Schema as Schema[K] extends PgTable
			? K extends `${infer Name}Table`
				? Name
				: K
			: never]: Schema[K];
	};
}
