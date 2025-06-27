import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

// For Vercel, use HTTP-based connection which works better with serverless
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Database URL must be set. Did you forget to configure the database?",
  );
}

console.log('Connecting to database via HTTP:', databaseUrl.includes('supabase') ? 'Supabase' : 'Other');

// Use neon HTTP client for Vercel serverless
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });