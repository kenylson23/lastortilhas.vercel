import { Pool } from 'pg';

// Create a direct PostgreSQL connection specifically for Supabase
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database URL is required");
}

export const directPool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  // Ensure we're using the public schema
  options: '-c search_path=public'
});

// Test connection and log schema information
directPool.on('connect', () => {
  console.log('Direct database connection established');
});

directPool.on('error', (err) => {
  console.error('Direct database connection error:', err);
});

export async function testConnection() {
  try {
    const result = await directPool.query('SELECT current_schema(), current_database()');
    console.log('Database connection test:', result.rows[0]);
    
    const tables = await directPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('Available tables:', tables.rows.map(row => row.table_name));
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export default directPool;