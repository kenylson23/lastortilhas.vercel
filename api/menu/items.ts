import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { menuItems } from '../../shared/schema';
import { eq, asc } from 'drizzle-orm';

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
      const { categoryId } = req.query;

      let items;

      if (categoryId) {
        items = await db.select()
          .from(menuItems)
          .where(eq(menuItems.categoryId, parseInt(categoryId as string)))
          .orderBy(asc(menuItems.order));
      } else {
        items = await db.select()
          .from(menuItems)
          .where(eq(menuItems.active, true))
          .orderBy(asc(menuItems.order));
      }

      return res.json(items);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Menu items error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}