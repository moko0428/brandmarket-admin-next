import { pgTable, bigint, text, timestamp, integer } from 'drizzle-orm/pg-core';

// 영수증 테이블
export const receipts = pgTable('receipts', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  storeName: text('store_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 영수증 품목 테이블
export const receiptItems = pgTable('receipt_items', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  receiptId: bigint('receipt_id', { mode: 'number' })
    .references(() => receipts.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
