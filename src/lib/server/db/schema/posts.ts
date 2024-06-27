import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-valibot';
import { usersTable } from './users';

export const postsTable = pgTable('posts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	title: text('title').notNull(),
	body: text('body').notNull()
});

export const insertPostSchema = createInsertSchema(postsTable);
