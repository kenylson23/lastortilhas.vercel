const { Pool } = require('pg');

// Database connection optimized for Vercel serverless
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

module.exports = async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, url } = req;
    const path = url?.split('?')[0] || '';

    // Health check endpoint
    if (path === '/api/health') {
      return res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Las Tortilhas API'
      });
    }

    // Menu categories endpoint
    if (path === '/api/menu/categories' && method === 'GET') {
      const result = await pool.query('SELECT * FROM menu_categories ORDER BY "order"');
      return res.json(result.rows);
    }

    // Menu items endpoint
    if (path === '/api/menu/items' && method === 'GET') {
      const result = await pool.query('SELECT * FROM menu_items WHERE active = true ORDER BY "order"');
      return res.json(result.rows);
    }

    // Gallery images endpoint
    if (path === '/api/gallery' && method === 'GET') {
      const result = await pool.query('SELECT * FROM gallery_images WHERE active = true ORDER BY "order"');
      return res.json(result.rows);
    }

    // Reservations endpoint
    if (path === '/api/reservations' && method === 'POST') {
      const { name, phone, email, date, time, guests, notes } = req.body;
      
      const result = await pool.query(
        `INSERT INTO reservations (name, phone, email, date, time, guests, notes, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW()) 
         RETURNING *`,
        [name, phone, email, date, time, guests, notes]
      );
      
      return res.status(201).json(result.rows[0]);
    }

    // Contact messages endpoint
    if (path === '/api/contact' && method === 'POST') {
      const { name, email, phone, message } = req.body;
      
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, phone, message, status, created_at) 
         VALUES ($1, $2, $3, $4, 'unread', NOW()) 
         RETURNING *`,
        [name, email, phone, message]
      );
      
      return res.status(201).json(result.rows[0]);
    }

    // User authentication check
    if (path === '/api/auth/user' && method === 'GET') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Default 404 response
    return res.status(404).json({ 
      message: 'Endpoint not found',
      path: path,
      availableEndpoints: [
        '/api/health',
        '/api/menu/categories',
        '/api/menu/items',
        '/api/gallery',
        '/api/reservations (POST)',
        '/api/contact (POST)'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
}