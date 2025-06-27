import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { galleryImages } from '../../shared/schema';
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
      const images = await db.select()
        .from(galleryImages)
        .where(eq(galleryImages.active, true))
        .orderBy(asc(galleryImages.order));

      return res.json(images);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Gallery error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}