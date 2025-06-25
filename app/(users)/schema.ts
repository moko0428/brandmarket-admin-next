import {
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const users = pgSchema('auth').table('users', {
  id: uuid().primaryKey(),
});

// 역할 enum
export const roles = pgEnum('role', ['admin', 'manager', 'user']);

// 기존 profiles 테이블
export const profiles = pgTable('profiles', {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  avatar: text(),
  location_name: text().notNull(),
  role: roles('role').default('user').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const stores = pgTable('stores', {
  store_id: uuid().primaryKey().defaultRandom(),
  address: text(),
  open_time: text(),
  close_time: text(),
  latitude: text(),
  longitude: text(),
  location: text(),
  description: text(),
  store_image: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
});
