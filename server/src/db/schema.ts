
import { pgTable, text, serial, integer, timestamp, date, boolean } from 'drizzle-orm/pg-core';

// --- Auth Tables (Better Auth Standard) ---
// --- Auth Tables (Better Auth Standard) ---
export const users = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    // Ubah nama kolom di database menjadi camelCase agar sinkron dengan Better Auth
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const sessions = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => users.id),
    token: text('token').notNull().unique(),
    // TAMBAHKAN DUA BARIS INI:
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const accounts = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => users.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    expiresAt: timestamp('expires_at'),
    password: text('password'),
    // TAMBAHKAN DUA BARIS INI (Wajib untuk Better Auth)
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verifications = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});

// --- App Specific Tables ---

// Stores the user's current goal/settings
export const goals = pgTable('goals', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    targetKhatam: integer('target_khatam').default(1),
    targetDays: integer('target_days').default(30),
    distributionMode: text('distribution_mode').default('per_hari'), // 'per_hari' | 'per_shalat' | 'bebas'
    startDate: date('start_date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Tracks daily reading activity
export const readingLogs = pgTable('reading_logs', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    date: date('date').notNull(), // YYYY-MM-DD
    pagesRead: integer('pages_read').default(0),
    juzCompleted: integer('juz_completed').array(), // Array of Juz numbers completed this day
    readAt: timestamp('read_at').defaultNow(), // Specific timestamp of the log
});

// Snapshots of progress (Streaks, aggregated stats)
export const userProgress = pgTable('user_progress', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id).unique(),
    currentStreak: integer('current_streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    totalPagesRead: integer('total_pages_read').default(0),
    completedJuzCount: integer('completed_juz_count').default(0),
    lastReadDate: date('last_read_date'),
    fajrReadCount: integer('fajr_read_count').default(0),
    updatedAt: timestamp('updated_at').defaultNow(),
});
