import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { registerRoutes } from '../server/routes-vercel.js';

const app = express();

// Configure CORS for Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.vercel.app', 'https://*.replit.app'] 
    : ['http://localhost:5000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight requests
app.options('*', cors());

// Parse requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for Vercel
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Setup routes
let routesInitialized = false;

async function initializeApp() {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel function error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}