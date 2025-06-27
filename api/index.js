const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { eq } = require('drizzle-orm');

// Database configuration
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

// Database tables (simplified schema)
const menuCategories = {
  id: 'id',
  name: 'name', 
  description: 'description',
  order: 'order'
};

const menuItems = {
  id: 'id',
  name: 'name',
  description: 'description', 
  price: 'price',
  categoryId: 'category_id',
  active: 'active'
};

const reservations = {
  name: 'name',
  phone: 'phone', 
  email: 'email',
  date: 'date',
  time: 'time',
  guests: 'guests',
  message: 'message',
  status: 'status'
};

const contactMessages = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  message: 'message', 
  status: 'status'
};

const galleryImages = {
  id: 'id',
  title: 'title',
  imageUrl: 'image_url',
  active: 'active'
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, url } = req;
    const path = url?.split('?')[0] || '';

    // Health check
    if (path === '/api/health') {
      return res.json({ status: 'OK' });
    }

    // Menu categories
    if (path === '/api/menu/categories' && method === 'GET') {
      const result = await pool.query('SELECT * FROM menu_categories ORDER BY "order"');
      return res.json(result.rows);
    }

    // Menu items
    if (path === '/api/menu/items' && method === 'GET') {
      const result = await pool.query('SELECT * FROM menu_items WHERE active = true ORDER BY "order"');
      return res.json(result.rows);
    }

    // Gallery images
    if (path === '/api/gallery' && method === 'GET') {
      const result = await pool.query('SELECT * FROM gallery_images WHERE active = true ORDER BY "order"');
      return res.json(result.rows);
    }

    // Reservations
    if (path === '/api/reservations' && method === 'POST') {
      const { name, phone, email, date, time, guests, message } = req.body;
      
      if (!name || !phone || !date || !time || !guests) {
        return res.status(400).json({ message: 'Campos obrigatórios em falta' });
      }

      const result = await pool.query(`
        INSERT INTO reservations (name, phone, email, date, time, guests, message, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `, [name, phone, email || null, new Date(date), time, parseInt(guests), message || null, 'pending']);

      return res.status(201).json(result.rows[0]);
    }

    // Contact messages
    if (path === '/api/contact' && method === 'POST') {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Campos obrigatórios em falta' });
      }

      const result = await pool.query(`
        INSERT INTO contact_messages (name, email, phone, message, status) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
      `, [name, email, phone || null, message, 'new']);

      return res.status(201).json(result.rows[0]);
    }

    // Default 404
    return res.status(404).json({ message: 'Rota não encontrada' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};