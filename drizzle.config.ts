/// <reference types="node" />
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dbCredentials: {
		// Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
		// Get from: Supabase → Project Settings → Database → Connection string (Transaction mode)
		url: process.env.DATABASE_URL!
	},
	verbose: true,
	strict: true
});
