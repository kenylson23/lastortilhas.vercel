/**
 * JWT Addon para Las Tortilhas
 * Adiciona suporte JWT mantendo o sistema de sessões existente
 */

import jwt from 'jsonwebtoken';
import type { Express, RequestHandler } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'las-tortilhas-jwt-secret-2025';

export interface JWTPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Gerar JWT
export function generateJWT(user: JWTPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

// Verificar JWT
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Middleware que adiciona suporte JWT às rotas existentes
export const jwtSupport: RequestHandler = (req: any, res, next) => {
  // Se já tem sessão ativa, continua
  if (req.session?.user) {
    return next();
  }

  // Verifica JWT no header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = verifyJWT(token);
    
    if (user) {
      // Simula sessão para compatibilidade
      req.session = req.session || {};
      req.session.user = user;
      req.isAuthenticated = () => true;
    }
  }

  next();
};

// Adicionar suporte JWT aos endpoints de login existentes
export function addJWTToAuth(app: Express) {
  // Interceptar resposta de login para adicionar JWT
  const originalLogin = app._router.stack.find((layer: any) => 
    layer.route?.path === '/api/login' && layer.route?.methods?.post
  );

  if (originalLogin) {
    // Middleware para adicionar JWT na resposta de login
    app.use('/api/login', (req: any, res: any, next) => {
      const originalJson = res.json;
      
      res.json = function(data: any) {
        // Se login bem-sucedido, adicionar JWT
        if (data.success && req.session?.user) {
          const token = generateJWT({
            id: req.session.user.id,
            email: req.session.user.email,
            firstName: req.session.user.firstName || 'Usuário',
            lastName: req.session.user.lastName || 'Las Tortilhas',
            role: req.session.user.role || 'user'
          });
          
          data.token = token;
        }
        
        return originalJson.call(this, data);
      };
      
      next();
    });
  }

  // Adicionar middleware JWT a todas as rotas da API
  app.use('/api', jwtSupport);
  
  console.log('JWT addon ativado - suporte dual para sessões e JWT');
}