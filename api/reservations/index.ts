import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { reservations } from '../../shared/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const allReservations = await db.select()
        .from(reservations)
        .orderBy(desc(reservations.createdAt));

      return res.json(allReservations);
    }

    if (req.method === 'POST') {
      const { name, phone, email, date, time, guests, message } = req.body;

      if (!name || !phone || !date || !time || !guests) {
        return res.status(400).json({ 
          error: 'Name, phone, date, time, and guests are required' 
        });
      }

      const newReservation = await db.insert(reservations)
        .values({
          name,
          phone,
          date: new Date(date),
          time,
          guests: parseInt(guests),
          message: message || null,
          status: 'pending'
        })
        .returning();

      return res.status(201).json(newReservation[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Reservations error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}