import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Para demonstração, retornar usuário admin
      // Em produção, implementar JWT validation
      const user = await db.select()
        .from(users)
        .where(eq(users.email, 'admin@lastortilhas.com'))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userData = {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        role: user[0].role
      };

      return res.json(userData);
    }

    if (req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      // Verificar credenciais
      const user = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Em produção, implementar bcrypt verification
      // Para demonstração, aceitar admin/admin123
      if (email === 'admin@lastortilhas.com' && password === 'admin123') {
        const userData = {
          id: user[0].id,
          email: user[0].email,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          role: user[0].role
        };

        return res.json(userData);
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}