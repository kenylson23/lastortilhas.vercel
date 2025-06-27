/**
 * Sistema de Autenticação Dupla - Las Tortilhas
 * Suporta sessões tradicionais (Replit) + JWT (Vercel)
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { storage } from './storage';
import type { Express, RequestHandler } from 'express';

// JWT Secret (deve ser definido nas variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'las-tortilhas-secret-key-2025';
const SESSION_SECRET = process.env.SESSION_SECRET || 'las-tortilhas-session-secret';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Funções de JWT
export function generateJWT(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyJWT(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

// Configuração de sessão tradicional
export function getSessionConfig() {
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  });
}

// Middleware de autenticação dupla
export const isDualAuthenticated: RequestHandler = async (req, res, next) => {
  // Primeiro, verificar sessão tradicional (Passport.js)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Se não há sessão, verificar JWT no header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = verifyJWT(token);
    
    if (user) {
      // Anexar usuário ao request para compatibilidade
      (req as any).user = user;
      (req as any).isAuthenticated = () => true;
      return next();
    }
  }

  // Se nenhum método funcionou, não autorizado
  return res.status(401).json({ message: "Unauthorized" });
};

// Configuração completa de autenticação
export async function setupDualAuth(app: Express) {
  // Configurar sessões tradicionais
  app.use(getSessionConfig());
  
  // Configurar Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // Estratégia de login local
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: string, password: string, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Usuário não encontrado' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Conta sem senha configurada' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Senha incorreta' });
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          username: user.username || user.email.split('@')[0],
          firstName: user.firstName || 'Usuário',
          lastName: user.lastName || 'Las Tortilhas',
          role: user.role || 'user'
        };

        return done(null, authUser);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialização de usuário para sessão
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        };
        done(null, authUser);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // Rotas de autenticação
  
  // Login com sessão tradicional + retorno de JWT
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: AuthUser, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      
      if (!user) {
        return res.status(401).json({ 
          message: info?.message || 'Credenciais inválidas' 
        });
      }

      // Login com sessão tradicional
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Erro ao criar sessão' });
        }

        // Gerar JWT para compatibilidade com Vercel
        const token = generateJWT(user);
        
        res.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token,
          message: 'Login realizado com sucesso'
        });
      });
    })(req, res, next);
  });

  // Registro de usuário
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      // Verificar se usuário já existe
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Usuário já existe' });
      }

      // Criar usuário
      const hashedPassword = await bcrypt.hash(password, 12);
      const username = email.split('@')[0];
      
      const newUser = await storage.createUser({
        email,
        password: hashedPassword,
        username,
        firstName: firstName || 'Usuário',
        lastName: lastName || 'Las Tortilhas',
        role: 'user'
      });

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      };

      // Login automático após registro
      req.logIn(authUser, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Usuário criado, mas erro ao fazer login' });
        }

        const token = generateJWT(authUser);
        
        res.status(201).json({
          user: authUser,
          token,
          message: 'Usuário criado e logado com sucesso'
        });
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });

  // Verificar usuário atual (suporta sessão e JWT)
  app.get('/api/auth/user', isDualAuthenticated, (req: any, res) => {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  });
}

// Middleware para verificar se é admin
export const isDualAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    // Primeiro verificar autenticação
    await new Promise<void>((resolve, reject) => {
      isDualAuthenticated(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Verificar se é admin
    const isUserAdmin = await storage.isAdmin(req.user.id);
    if (!isUserAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication required" });
  }
};