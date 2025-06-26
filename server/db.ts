import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use available database (Replit PostgreSQL or Supabase)
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Database connection not available.",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : false,
  // Add explicit schema configuration
  options: '-c search_path=public'
});

export const db = drizzle(pool, { schema });