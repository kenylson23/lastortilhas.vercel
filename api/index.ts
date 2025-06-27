import { Request, Response } from 'express';
import { db } from '../server/db-vercel.js';
import { menuCategories, menuItems, reservations, contactMessages, galleryImages } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, url } = req;
    const path = url?.split('?')[0] || '';

    // Health check
    if (path === '/health') {
      return res.json({ status: 'OK' });
    }

    // Menu categories
    if (path === '/menu/categories' && method === 'GET') {
      const categories = await db.select().from(menuCategories);
      return res.json(categories);
    }

    // Menu items
    if (path === '/menu/items' && method === 'GET') {
      const items = await db.select().from(menuItems)
        .where(eq(menuItems.active, true));
      return res.json(items);
    }

    // Gallery images
    if (path === '/gallery' && method === 'GET') {
      const images = await db.select().from(galleryImages)
        .where(eq(galleryImages.active, true));
      return res.json(images);
    }

    // Reservations
    if (path === '/reservations' && method === 'POST') {
      const { name, phone, email, date, time, guests, message } = req.body;
      
      if (!name || !phone || !date || !time || !guests) {
        return res.status(400).json({ message: 'Campos obrigatórios em falta' });
      }

      const reservation = {
        name,
        phone,
        email: email || null,
        date: new Date(date),
        time,
        guests: parseInt(guests),
        message: message || null,
        status: 'pending'
      };

      const [newReservation] = await db.insert(reservations).values(reservation).returning();
      return res.status(201).json(newReservation);
    }

    // Contact messages
    if (path === '/contact' && method === 'POST') {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Campos obrigatórios em falta' });
      }

      const contact = {
        name,
        email,
        phone: phone || null,
        message,
        status: 'new'
      };

      const [newContact] = await db.insert(contactMessages).values(contact).returning();
      return res.status(201).json(newContact);
    }

    // Default 404
    return res.status(404).json({ message: 'Rota não encontrada' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}