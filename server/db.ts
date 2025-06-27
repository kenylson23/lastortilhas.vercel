import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Priority order: Railway -> Supabase -> Replit -> Local
const databaseUrl = 
  process.env.DATABASE_PRIVATE_URL || // Railway private connection
  process.env.DATABASE_URL || // Standard DATABASE_URL (Railway public or others)
  process.env.SUPABASE_DATABASE_URL; // Supabase connection

if (!databaseUrl) {
  throw new Error(
    "Database URL must be set. Did you forget to configure the database?",
  );
}

// Log database provider for debugging
const provider = databaseUrl.includes('railway') ? 'Railway' : 
                databaseUrl.includes('supabase') ? 'Supabase' : 'Other';
console.log('Connecting to database:', provider);

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  // Add explicit schema configuration
  options: '-c search_path=public'
});

export const db = drizzle(pool, { schema });