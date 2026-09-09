import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(),
  active: integer('active').notNull().default(1),
  createdAt: integer('created_at').notNull(),
});
export const adminSessions = sqliteTable(
  'admin_sessions',
  {
    id: text('id').primaryKey(),
    tokenHash: text('token_hash').notNull().unique(),
    userId: text('user_id').notNull(),
    createdAt: integer('created_at').notNull(),
    expiresAt: integer('expires_at').notNull(),
    userAgent: text('user_agent').notNull(),
  },
  (t) => [
    index('admin_sessions_user').on(t.userId),
    index('admin_sessions_expiry').on(t.expiresAt),
  ],
);
export const adminLoginLimits = sqliteTable('admin_login_limits', {
  id: text('id').primaryKey(),
  attempts: integer('attempts').notNull(),
  resetAt: integer('reset_at').notNull(),
});
export const adminAudit = sqliteTable(
  'admin_audit',
  {
    id: text('id').primaryKey(),
    actorId: text('actor_id').notNull(),
    actorName: text('actor_name').notNull(),
    action: text('action').notNull(),
    target: text('target').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [index('admin_audit_created').on(t.createdAt)],
);
