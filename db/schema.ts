import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
// Retained intact for migration from the first release, never discarded.
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  version: integer('version').notNull().default(0),
});
export const siteState = sqliteTable('site_state', {
  id: text('id').primaryKey(),
  version: integer('version').notNull(),
  settings: text('settings').notNull(),
  writeToken: text('write_token').notNull(),
  updatedAt: text('updated_at').notNull(),
});
export const contentRecords = sqliteTable(
  'content_records',
  {
    id: text('id').primaryKey(),
    collection: text('collection').notNull(),
    kind: text('kind').notNull().default(''),
    slug: text('slug').notNull().default(''),
    status: text('status').notNull().default('published'),
    sortOrder: integer('sort_order').notNull().default(0),
    body: text('body').notNull(),
  },
  (t) => [
    index('records_collection_status_order').on(
      t.collection,
      t.status,
      t.sortOrder,
    ),
    index('records_kind_slug').on(t.kind, t.slug),
  ],
);
export const redirects = sqliteTable('redirects', {
  path: text('path').primaryKey(),
  entryId: text('entry_id').notNull(),
  createdAt: text('created_at').notNull(),
});
export const contentHistory = sqliteTable(
  'content_history',
  {
    id: text('id').primaryKey(),
    version: integer('version').notNull(),
    createdAt: text('created_at').notNull(),
    actor: text('actor').notNull(),
    summary: text('summary').notNull(),
    snapshot: text('snapshot').notNull(),
  },
  (t) => [index('history_created').on(t.createdAt)],
);
export const quotes = sqliteTable(
  'quotes',
  {
    id: text('id').primaryKey(),
    reference: text('reference').notNull().unique(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    status: text('status').notNull().default('new'),
    notes: text('notes').notNull().default(''),
    version: integer('version').notNull().default(1),
    demo: integer('demo').notNull().default(0),
    input: text('input').notNull(),
    snapshot: text('snapshot').notNull(),
    requestHash: text('request_hash').notNull(),
  },
  (t) => [index('quotes_status_date').on(t.status, t.createdAt)],
);
export const submissionLimits = sqliteTable('submission_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expires: integer('expires').notNull(),
});
export const mediaObjects = sqliteTable('media_objects', {
  id: text('id').primaryKey(),
  keys: text('keys').notNull(),
  createdAt: text('created_at').notNull(),
});
