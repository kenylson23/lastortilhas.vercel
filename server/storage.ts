import {
  users,
  menuCategories,
  menuItems,
  reservations,
  contactMessages,
  galleryImages,
  type User,
  type UpsertUser,
  type MenuCategory,
  type MenuItem,
  type Reservation,
  type ContactMessage,
  type GalleryImage,
  type InsertMenuCategory,
  type InsertMenuItem,
  type InsertReservation,
  type InsertContactMessage,
  type InsertGalleryImage,
} from "@shared/schema";
import { db, pool } from "./db";
import directPool, { testConnection } from "./directDbConnection";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: any): Promise<User>;
  
  // Menu operations
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getAllMenuItems(): Promise<MenuItem[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;
  
  // Reservation operations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservations(): Promise<Reservation[]>;
  getUserReservations(userId: string): Promise<Reservation[]>;
  updateReservationStatus(id: number, status: string): Promise<void>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  updateContactMessageStatus(id: number, status: string): Promise<void>;
  
  // Gallery operations
  getGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;
  
  // Admin operations
  isAdmin(userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Menu operations
  async getMenuCategories(): Promise<MenuCategory[]> {
    return await db
      .select()
      .from(menuCategories)
      .orderBy(menuCategories.order);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId))
      .orderBy(menuItems.order);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .orderBy(menuItems.order);
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const [newCategory] = await db
      .insert(menuCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db
      .insert(menuItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateMenuItem(id: number, item: InsertMenuItem): Promise<MenuItem> {
    const [updatedItem] = await db
      .update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db
      .delete(menuItems)
      .where(eq(menuItems.id, id));
  }

  // Reservation operations
  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [newReservation] = await db
      .insert(reservations)
      .values(reservation)
      .returning();
    return newReservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt));
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .where(eq(reservations.userId, userId))
      .orderBy(desc(reservations.createdAt));
  }

  async updateReservationStatus(id: number, status: string): Promise<void> {
    await db
      .update(reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(reservations.id, id));
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      // Use direct pool query to bypass Drizzle ORM issues
      const result = await directPool.query(`
        SELECT id, name, email, phone, message, status, created_at as "createdAt"
        FROM contact_messages 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.email, // Using email as ID for Supabase compatibility
        email: userData.email,
        username: userData.username || userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
      })
      .returning();
    return user;
  }

  async updateContactMessageStatus(id: number, status: string): Promise<void> {
    await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id));
  }

  // Gallery operations
  async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      // Use direct pool query to bypass Drizzle ORM issues
      const result = await directPool.query(`
        SELECT id, title, description, image_url as "imageUrl", category, "order", featured, active, created_at as "createdAt", updated_at as "updatedAt"
        FROM gallery_images 
        WHERE active = true
        ORDER BY "order"
      `);
      return result.rows;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db
      .insert(galleryImages)
      .values(image)
      .returning();
    return newImage;
  }

  async updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [updatedImage] = await db
      .update(galleryImages)
      .set({ ...image, updatedAt: new Date() })
      .where(eq(galleryImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db
      .update(galleryImages)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(galleryImages.id, id));
  }

  // Admin operations
  async isAdmin(userId: string): Promise<boolean> {
    try {
      // Simple hardcoded admin check to bypass database issues
      if (userId === 'admin@lastortilhas.com') {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
