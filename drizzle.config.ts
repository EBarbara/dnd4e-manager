import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_FILE || 'file:dnd4e.db',
    },
});
