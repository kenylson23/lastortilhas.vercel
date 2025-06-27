/**
 * Las Tortilhas - Vercel Serverless API
 * Complete backend with authentication, database, and business logic
 */
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Database connection optimized for Vercel serverless
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

// JWT utilities
const JWT_SECRET = process.env.JWT_SECRET || 'las-tortilhas-jwt-secret';

function generateJWT(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role
  }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Authentication middleware
function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyJWT(token);
}

// CORS helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// Main handler function
export default async function handler(req, res) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, url } = req;
    const path = url?.split('?')[0] || '';
    const query = new URL(url, `http://${req.headers.host}`).searchParams;

    console.log(`${method} ${path}`);

    // Health check endpoint
    if (path === '/api/health') {
      return res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Las Tortilhas API',
        version: '2.0.0'
      });
    }

    // Authentication endpoints
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password required' 
        });
      }

      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      const user = userResult.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      const token = generateJWT(user);
      
      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      });
    }

    if (path === '/api/auth/register' && method === 'POST') {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password required' 
        });
      }

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ 
          success: false, 
          error: 'User already exists' 
        });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newUser = await pool.query(
        `INSERT INTO users (id, email, password, first_name, last_name, role, created_at) 
         VALUES ($1, $2, $3, $4, $5, 'user', NOW()) 
         RETURNING *`,
        [userId, email, hashedPassword, firstName, lastName]
      );

      const user = newUser.rows[0];
      const token = generateJWT(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      });
    }

    if (path === '/api/auth/user' && method === 'GET') {
      const user = authenticate(req);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Unauthorized' 
        });
      }

      return res.json({
        success: true,
        user
      });
    }

    // Menu endpoints
    if (path === '/api/menu/categories' && method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM menu_categories ORDER BY "order", name'
      );
      return res.json({
        success: true,
        data: result.rows
      });
    }

    if (path === '/api/menu/items' && method === 'GET') {
      const categoryId = query.get('category');
      let queryStr = 'SELECT * FROM menu_items WHERE active = true';
      let params = [];
      
      if (categoryId) {
        queryStr += ' AND category_id = $1';
        params.push(categoryId);
      }
      
      queryStr += ' ORDER BY "order", name';
      
      const result = await pool.query(queryStr, params);
      return res.json({
        success: true,
        data: result.rows
      });
    }

    // Gallery endpoint
    if (path === '/api/gallery' && method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM gallery_images WHERE active = true ORDER BY "order", created_at DESC'
      );
      return res.json({
        success: true,
        data: result.rows
      });
    }

    // Reservations endpoint
    if (path === '/api/reservations' && method === 'POST') {
      const { name, phone, email, date, time, guests, notes } = req.body;
      
      if (!name || !phone || !date || !time || !guests) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, phone, date, time, and guests are required' 
        });
      }

      const user = authenticate(req);
      
      const result = await pool.query(
        `INSERT INTO reservations (user_id, name, phone, email, date, time, guests, notes, status, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
         RETURNING *`,
        [user?.id || null, name, phone, email, date, time, guests, notes]
      );
      
      return res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    }

    // Admin: Get reservations
    if (path === '/api/reservations' && method === 'GET') {
      const user = authenticate(req);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }

      const result = await pool.query(
        'SELECT * FROM reservations ORDER BY created_at DESC'
      );
      return res.json({
        success: true,
        data: result.rows
      });
    }

    // Contact messages endpoint
    if (path === '/api/contact' && method === 'POST') {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, email, and message are required' 
        });
      }

      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, phone, message, status, created_at) 
         VALUES ($1, $2, $3, $4, 'unread', NOW()) 
         RETURNING *`,
        [name, email, phone, message]
      );
      
      return res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    }

    // Admin: Get contact messages
    if (path === '/api/contact' && method === 'GET') {
      const user = authenticate(req);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }

      const result = await pool.query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
      );
      return res.json({
        success: true,
        data: result.rows
      });
    }

    // Root API endpoint
    if (path === '/api' || path === '/api/') {
      return res.json({ 
        message: 'Las Tortilhas API - Mexican Restaurant Platform',
        version: '2.0.0',
        environment: process.env.NODE_ENV,
        endpoints: [
          'GET /api/health',
          'POST /api/auth/login',
          'POST /api/auth/register',
          'GET /api/auth/user',
          'GET /api/menu/categories',
          'GET /api/menu/items',
          'GET /api/gallery',
          'POST /api/reservations',
          'GET /api/reservations (admin)',
          'POST /api/contact',
          'GET /api/contact (admin)'
        ]
      });
    }

    // 404 for unknown endpoints
    return res.status(404).json({ 
      success: false,
      error: 'Endpoint not found',
      path: path,
      availableEndpoints: [
        '/api/health',
        '/api/auth/login',
        '/api/menu/categories',
        '/api/menu/items',
        '/api/gallery',
        '/api/reservations',
        '/api/contact'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
      timestamp: new Date().toISOString()
    });
  } finally {
    // Ensure pool connections are released in serverless environment
    if (pool.totalCount > 0) {
      setTimeout(() => {
        pool.end().catch(console.error);
      }, 100);
    }
  }
}