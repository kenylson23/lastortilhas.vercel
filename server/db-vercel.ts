import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Supabase connection for Vercel
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Supabase DATABASE_URL must be set. Please configure your Supabase connection string.",
  );
}

console.log('Connecting to Supabase database');

// Optimized connection pool for Vercel serverless
export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });