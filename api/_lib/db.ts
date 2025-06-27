import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../shared/schema';

// Configuração específica para Vercel
const databaseUrl = 
  process.env.POSTGRES_URL || // Vercel Postgres
  process.env.DATABASE_URL || // Fallback padrão
  process.env.SUPABASE_DATABASE_URL; // Supabase

if (!databaseUrl) {
  throw new Error('Database URL not configured. Set POSTGRES_URL environment variable.');
}

// Pool otimizado para serverless functions
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 1, // Importante para serverless - uma conexão por função
  min: 0,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

// Função para fechar conexões após uso (importante no Vercel)
export const closeConnection = async () => {
  await pool.end();
};