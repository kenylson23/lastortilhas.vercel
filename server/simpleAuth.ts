import express, { type Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Simple in-memory user store for sessions
const activeUsers = new Map<string, any>();

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
  });

  return session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "fallback-secret-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionTtl,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
}

export async function setupAuth(app: Express) {
  app.use('/api', express.json());
  app.use('/api', express.urlencoded({ extended: true }));
  app.use(getSession());

  // Simple login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Tentativa de login para: ${email}`);

      // Admin authentication
      if (email === 'admin@lastortilhas.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin@lastortilhas.com',
          email: 'admin@lastortilhas.com',
          firstName: 'Admin',
          lastName: 'Las Tortilhas',
          role: 'admin'
        };

        // Store in session and memory
        (req.session as any).user = adminUser;
        activeUsers.set(req.sessionID, adminUser);

        console.log(`Login de administrador realizado para: ${email}`);
        return res.json({
          message: 'Login realizado com sucesso',
          user: adminUser
        });
      }

      // Simple user authentication
      if (password && password.length >= 6) {
        const simpleUser = {
          id: email,
          email: email,
          firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          lastName: 'Cliente',
          role: 'user'
        };

        // Store in session and memory
        (req.session as any).user = simpleUser;
        activeUsers.set(req.sessionID, simpleUser);

        console.log(`Login/registro realizado para: ${email}`);
        return res.json({
          message: 'Login realizado com sucesso',
          user: simpleUser
        });
      }

      return res.status(401).json({ message: 'Credenciais inválidas' });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    const sessionId = req.sessionID;
    activeUsers.delete(sessionId);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });

  // Auth user endpoint
  app.get('/api/auth/user', (req, res) => {
    const sessionUser = (req.session as any).user || activeUsers.get(req.sessionID);
    
    if (!sessionUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(sessionUser);
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const sessionUser = (req.session as any).user || activeUsers.get(req.sessionID);
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  (req as any).user = sessionUser;
  next();
};