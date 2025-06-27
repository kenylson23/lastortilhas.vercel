import { Express, RequestHandler } from 'express';
import bcryptjs from 'bcryptjs';
import { db } from './db-vercel.js';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Simple session store for Vercel (in-memory)
const sessions = new Map<string, AuthUser>();

export function getSession() {
  return {
    get: (req: any) => sessions.get(req.sessionID),
    set: (req: any, user: AuthUser) => sessions.set(req.sessionID, user),
    destroy: (req: any) => sessions.delete(req.sessionID)
  };
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthUser> {
  const hashedPassword = await bcryptjs.hash(userData.password, 12);
  
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    email: userData.email,
    username: userData.email.split('@')[0],
    firstName: userData.firstName || userData.email.split('@')[0],
    lastName: userData.lastName || 'User',
    password: hashedPassword,
    role: 'user'
  };

  const [user] = await db.insert(users).values(newUser).returning();
  
  return {
    id: user.id,
    email: user.email!,
    username: user.username!,
    firstName: user.firstName!,
    lastName: user.lastName!,
    role: user.role!
  };
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email!,
    username: user.username!,
    firstName: user.firstName!,
    lastName: user.lastName!,
    role: user.role!
  };
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}

export async function setupAuth(app: Express) {
  // Login endpoint
  app.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      const [dbUser] = await db.select().from(users).where(eq(users.email, email));
      
      if (!dbUser || !dbUser.password) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isValid = await verifyPassword(password, dbUser.password);
      
      if (!isValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const user: AuthUser = {
        id: dbUser.id,
        email: dbUser.email!,
        username: dbUser.username!,
        firstName: dbUser.firstName!,
        lastName: dbUser.lastName!,
        role: dbUser.role!
      };

      getSession().set(req, user);
      res.json({ user, message: 'Login realizado com sucesso' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Register endpoint
  app.post('/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Usuário já existe' });
      }

      const user = await createUser({ email, password, firstName, lastName });
      getSession().set(req, user);
      
      res.status(201).json({ user, message: 'Cadastro realizado com sucesso' });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Logout endpoint
  app.post('/auth/logout', (req, res) => {
    getSession().destroy(req);
    res.json({ message: 'Logout realizado com sucesso' });
  });

  // Get current user endpoint
  app.get('/auth/user', (req, res) => {
    const user = getSession().get(req);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = getSession().get(req);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};