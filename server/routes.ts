import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleDirectAuth";
import { insertReservationSchema, insertContactMessageSchema, insertMenuCategorySchema, insertMenuItemSchema, insertGalleryImageSchema } from "@shared/schema";
import { z } from "zod";

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const isUserAdmin = await storage.isAdmin(req.user.id);
  if (!isUserAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without sensitive data
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get auth status (public endpoint)
  app.get('/api/auth/status', (req, res) => {
    res.json({ 
      authenticated: req.isAuthenticated(),
      sessionId: req.sessionID
    });
  });

  // User profile update
  app.put('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).json({ message: "Nome e sobrenome são obrigatórios" });
      }

      const updatedUser = await storage.upsertUser({
        id: userId,
        firstName,
        lastName,
        email: req.user.email,
        username: req.user.username
      });

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Menu routes
  app.get('/api/menu/categories', async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching menu categories:", error);
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  app.get('/api/menu/items', async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string;
      let items;
      
      if (categoryId) {
        items = await storage.getMenuItemsByCategory(parseInt(categoryId));
      } else {
        items = await storage.getAllMenuItems();
      }
      
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Reservation routes
  app.post('/api/reservations', async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      
      // Convert date string to Date object and prepare data for database
      const reservationData = {
        userId: validatedData.userId || undefined,
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || undefined,
        date: typeof validatedData.date === 'string' ? new Date(validatedData.date) : validatedData.date,
        time: validatedData.time,
        guests: validatedData.guests,
        notes: validatedData.notes || undefined,
        status: validatedData.status || "pending",
        whatsappSent: false,
      };
      
      const reservation = await storage.createReservation(reservationData);
      res.json(reservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create reservation" });
      }
    }
  });

  app.get('/api/reservations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reservations = await storage.getUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Contact routes
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Gallery routes (public)
  app.get('/api/gallery', async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  // Admin routes (protected)
  app.get('/api/admin/dashboard', isAdmin, async (req, res) => {
    try {
      const [reservations, contacts, menuItems, galleryCount] = await Promise.all([
        storage.getReservations(),
        storage.getContactMessages(),
        storage.getAllMenuItems(),
        storage.getGalleryImages()
      ]);

      res.json({
        stats: {
          totalReservations: reservations.length,
          pendingReservations: reservations.filter(r => r.status === 'pending').length,
          newContacts: contacts.filter(c => c.status === 'new').length,
          totalMenuItems: menuItems.length,
          galleryImages: galleryCount.length
        },
        recentReservations: reservations.slice(0, 5),
        recentContacts: contacts.slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Menu Management
  app.post('/api/admin/menu/categories', isAdmin, async (req, res) => {
    try {
      const validatedData = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(validatedData);
      res.json(category);
    } catch (error) {
      console.error("Error creating menu category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  app.post('/api/admin/menu/items', isAdmin, async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating menu item:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  app.put('/api/admin/menu/items/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.updateMenuItem(parseInt(id), validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error updating menu item:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update item" });
      }
    }
  });

  app.delete('/api/admin/menu/items/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMenuItem(parseInt(id));
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Reservation Management
  app.get('/api/admin/reservations', isAdmin, async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching all reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.put('/api/admin/reservations/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateReservationStatus(parseInt(id), status);
      res.json({ message: "Reservation status updated successfully" });
    } catch (error) {
      console.error("Error updating reservation:", error);
      res.status(500).json({ message: "Failed to update reservation" });
    }
  });

  // Gallery Management
  app.get('/api/admin/gallery', isAdmin, async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.post('/api/admin/gallery', isAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.json(image);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid image data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create image" });
      }
    }
  });

  app.put('/api/admin/gallery/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(parseInt(id), validatedData);
      res.json(image);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(500).json({ message: "Failed to update image" });
    }
  });

  app.delete('/api/admin/gallery/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGalleryImage(parseInt(id));
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Contact Management
  app.get('/api/admin/contacts', isAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContactMessages();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.put('/api/admin/contacts/:id', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateContactMessageStatus(parseInt(id), status);
      res.json({ message: "Contact status updated successfully" });
    } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.get('/api/admin/messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
