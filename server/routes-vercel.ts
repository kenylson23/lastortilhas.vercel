import { Express } from 'express';
import { setupAuth, isAuthenticated } from './auth-vercel.js';
import { db } from './db-vercel.js';
import { menuCategories, menuItems, reservations, contactMessages, galleryImages } from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function registerRoutes(app: Express) {
  // Health check endpoint (simplified)
  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  // Setup authentication routes
  await setupAuth(app);

  // Menu routes
  app.get('/menu/categories', async (req, res) => {
    try {
      const categories = await db.select().from(menuCategories).orderBy(menuCategories.order);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      res.status(500).json({ message: 'Erro ao buscar categorias do menu' });
    }
  });

  app.get('/menu/items', async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string;
      
      if (categoryId) {
        const items = await db.select().from(menuItems)
          .where(and(
            eq(menuItems.categoryId, parseInt(categoryId)),
            eq(menuItems.active, true)
          ))
          .orderBy(menuItems.order);
        res.json(items);
      } else {
        const items = await db.select().from(menuItems)
          .where(eq(menuItems.active, true))
          .orderBy(menuItems.order);
        res.json(items);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ message: 'Erro ao buscar itens do menu' });
    }
  });

  // Reservation routes
  app.post('/reservations', async (req, res) => {
    try {
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
      res.status(201).json(newReservation);
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ message: 'Erro ao criar reserva' });
    }
  });

  app.get('/reservations', isAuthenticated, async (req, res) => {
    try {
      const allReservations = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
      res.json(allReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Erro ao buscar reservas' });
    }
  });

  // Contact routes
  app.post('/contact', async (req, res) => {
    try {
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
      res.status(201).json(newContact);
    } catch (error) {
      console.error('Error creating contact message:', error);
      res.status(500).json({ message: 'Erro ao enviar mensagem' });
    }
  });

  app.get('/contact', isAuthenticated, async (req, res) => {
    try {
      const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
      res.json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ message: 'Erro ao buscar mensagens' });
    }
  });

  // Gallery routes
  app.get('/gallery', async (req, res) => {
    try {
      const images = await db.select().from(galleryImages)
        .where(eq(galleryImages.active, true))
        .orderBy(galleryImages.order);
      res.json(images);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      res.status(500).json({ message: 'Erro ao buscar imagens da galeria' });
    }
  });

  // Admin routes
  app.get('/admin/stats', isAuthenticated, async (req, res) => {
    try {
      // Use simpler count queries to avoid execution time issues
      const allReservations = await db.select().from(reservations);
      const allContacts = await db.select().from(contactMessages);
      const allMenuItems = await db.select().from(menuItems);
      const allGalleryImages = await db.select().from(galleryImages);

      const pendingReservations = allReservations.filter(r => r.status === 'pending');
      const newContacts = allContacts.filter(c => c.status === 'new');

      res.json({
        totalReservations: allReservations.length,
        pendingReservations: pendingReservations.length,
        newContacts: newContacts.length,
        totalMenuItems: allMenuItems.length,
        galleryImages: allGalleryImages.length
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
  });

  // Catch-all route for SPA
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
  });
}