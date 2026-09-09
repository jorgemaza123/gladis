import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// A versioned aggregate keeps this first CMS atomic. The repository is the only
// consumer of its storage shape; collections can move to separate tables later.
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  version: integer('version').notNull().default(0),
});
