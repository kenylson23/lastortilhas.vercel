const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.url === '/api/menu/categories') {
      const result = await pool.query('SELECT * FROM menu_categories ORDER BY "order"');
      return res.json(result.rows);
    }

    if (req.url === '/api/menu/items') {
      const result = await pool.query('SELECT * FROM menu_items WHERE active = true ORDER BY "order"');
      return res.json(result.rows);
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.error('Menu API Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};