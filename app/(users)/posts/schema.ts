import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  json,
} from 'drizzle-orm/pg-core';
import { profiles } from '../schema';

// 게시물 타입 enum
export const postTypes = ['user_photo', 'admin_product'] as const;

// 게시물 테이블
export const posts = pgTable('posts', {
  post_id: uuid().primaryKey().defaultRandom(),
  author_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  post_type: text('post_type').notNull(), // 'user_photo' | 'admin_product'
  title: text().notNull(),
  content: text(),
  images: json('images').$type<string[]>().default([]).notNull(), // 이미지 URL 배열

  // 상품 정보 (어드민 게시물용)
  product_name: text(),
  price: integer(),
  size: text(),
  color: text(),
  available_stores: json('available_stores').$type<string[]>().default([]), // 매장 ID 배열

  // 메타데이터
  is_published: boolean().default(true).notNull(),
  view_count: integer().default(0).notNull(),
  like_count: integer().default(0).notNull(),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});

// 게시물 좋아요 테이블
export const post_likes = pgTable('post_likes', {
  id: uuid().primaryKey().defaultRandom(),
  post_id: uuid()
    .notNull()
    .references(() => posts.post_id, { onDelete: 'cascade' }),
  user_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, { onDelete: 'cascade' }),
  created_at: timestamp().defaultNow().notNull(),
});
