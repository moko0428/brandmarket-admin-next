import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/**/schema.ts',
  out: './sql/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
