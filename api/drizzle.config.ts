import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/usersSchema.ts',
    './src/db/productsSchema.ts',
    './src/db/ordersSchema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
