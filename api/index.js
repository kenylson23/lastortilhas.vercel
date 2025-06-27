const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'las-tortilhas-secret-key-2025';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Las Tortilhas API' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (id, email, password, first_name, last_name, username, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        `user-${Date.now()}`,
        email,
        hashedPassword,
        firstName,
        lastName,
        email.split('@')[0],
        'user'
      ]
    );
    
    const user = result.rows[0];
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/user', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Menu routes
app.get('/api/menu/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_categories ORDER BY "order"');
    res.json(result.rows);
  } catch (error) {
    console.error('Menu categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/menu/items', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM menu_items WHERE active = true';
    let params = [];
    
    if (category) {
      query += ' AND category_id = $1';
      params.push(category);
    }
    
    query += ' ORDER BY "order"';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Menu items error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reservations
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, notes } = req.body;
    
    const result = await pool.query(
      'INSERT INTO reservations (name, phone, email, date, time, guests, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, phone, email, date, time, guests, notes, 'pending']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, subject, message, 'unread']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_images WHERE active = true ORDER BY "order"');
    res.json(result.rows);
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) FROM reservations'),
      pool.query('SELECT COUNT(*) FROM contact_messages WHERE status = $1', ['unread']),
      pool.query('SELECT COUNT(*) FROM menu_items WHERE active = true'),
      pool.query('SELECT COUNT(*) FROM users')
    ]);
    
    res.json({
      totalReservations: parseInt(stats[0].rows[0].count),
      unreadMessages: parseInt(stats[1].rows[0].count),
      activeMenuItems: parseInt(stats[2].rows[0].count),
      totalUsers: parseInt(stats[3].rows[0].count)
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Default route
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;