import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use Supabase as primary database
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DATABASE_URL must be set. Did you forget to configure Supabase?",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }, // Always use SSL for Supabase
  // Add explicit schema configuration for Supabase
  options: '-c search_path=public'
});

export const db = drizzle(pool, { schema });