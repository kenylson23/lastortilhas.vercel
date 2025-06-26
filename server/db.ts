import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Force Supabase connection
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Database URL must be set. Did you forget to configure the database?",
  );
}

console.log('Connecting to database:', databaseUrl.includes('supabase') ? 'Supabase' : 'Other');

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  // Add explicit schema configuration
  options: '-c search_path=public'
});

export const db = drizzle(pool, { schema });