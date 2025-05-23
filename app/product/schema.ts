import { bigint, pgTable, text } from 'drizzle-orm/pg-core';

export const test = pgTable('test', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
});
