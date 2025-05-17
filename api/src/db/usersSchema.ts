import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default('user'),
  name: varchar({ length: 255 }),
  address: text(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  role: true,
});

export const loginSchema = createSelectSchema(usersTable).pick({
  email: true,
  password: true,
});
