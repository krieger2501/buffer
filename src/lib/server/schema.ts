import { pgTable, uuid, text, numeric, boolean, timestamp, date } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	name: text('name').notNull(),
	type: text('type').notNull().default('checking'),
	balance: numeric('balance', { precision: 12, scale: 2 }).notNull().default('0'),
	currency: text('currency').notNull().default('EUR'),
	includeInTotal: boolean('include_in_total').notNull().default(true),
	color: text('color'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const expenses = pgTable('expenses', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	name: text('name').notNull(),
	category: text('category').notNull().default('other'),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	recurrence: text('recurrence').notNull().default('monthly'),
	dayOfMonth: text('day_of_month'),
	dueDate: date('due_date'),
	accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'set null' }),
	notes: text('notes'),
	active: boolean('active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const income = pgTable('income', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	name: text('name').notNull(),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	recurrence: text('recurrence').notNull().default('monthly'),
	dayOfMonth: text('day_of_month'),
	expectedDate: date('expected_date'),
	received: boolean('received').notNull().default(false),
	accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'set null' }),
	notes: text('notes'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const debts = pgTable('debts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	direction: text('direction').notNull(),
	counterparty: text('counterparty').notNull(),
	amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
	paid: boolean('paid').notNull().default(false),
	dueDate: date('due_date'),
	notes: text('notes'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const userSettings = pgTable('user_settings', {
	userId: uuid('user_id').primaryKey(),
	displayName: text('display_name'),
	currency: text('currency').notNull().default('EUR'),
	weekStartDay: text('week_start_day').notNull().default('monday'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export type Account = typeof accounts.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Income = typeof income.$inferSelect;
export type Debt = typeof debts.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
