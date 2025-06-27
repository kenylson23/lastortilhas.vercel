import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { menuCategories } from '../../shared/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const categories = await db.select()
        .from(menuCategories)
        .orderBy(asc(menuCategories.order));

      return res.json(categories);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Menu categories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}