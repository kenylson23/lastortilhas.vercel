import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

interface MigrationData {
  menuCategories: any[];
  menuItems: any[];
  users: any[];
  reservations: any[];
  contactMessages: any[];
}

async function exportCurrentData(): Promise<MigrationData> {
  const currentPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const currentDb = drizzle(currentPool, { schema });

  console.log('Exporting current data...');

  try {
    const [menuCategories, menuItems, users, reservations, contactMessages] = await Promise.all([
      currentDb.select().from(schema.menuCategories),
      currentDb.select().from(schema.menuItems),
      currentDb.select().from(schema.users),
      currentDb.select().from(schema.reservations),
      currentDb.select().from(schema.contactMessages),
    ]);

    console.log(`Found ${menuCategories.length} menu categories`);
    console.log(`Found ${menuItems.length} menu items`);
    console.log(`Found ${users.length} users`);
    console.log(`Found ${reservations.length} reservations`);
    console.log(`Found ${contactMessages.length} contact messages`);

    await currentPool.end();

    return {
      menuCategories,
      menuItems,
      users,
      reservations,
      contactMessages,
    };
  } catch (error) {
    await currentPool.end();
    throw error;
  }
}

async function importToSupabase(data: MigrationData, supabaseUrl: string) {
  const supabasePool = new Pool({ 
    connectionString: supabaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  const supabaseDb = drizzle(supabasePool, { schema });

  console.log('Importing data to Supabase...');

  try {
    // Import menu categories first (they have no dependencies)
    if (data.menuCategories.length > 0) {
      await supabaseDb.insert(schema.menuCategories).values(data.menuCategories);
      console.log(`Imported ${data.menuCategories.length} menu categories`);
    }

    // Import menu items (depend on categories)
    if (data.menuItems.length > 0) {
      await supabaseDb.insert(schema.menuItems).values(data.menuItems);
      console.log(`Imported ${data.menuItems.length} menu items`);
    }

    // Import users
    if (data.users.length > 0) {
      await supabaseDb.insert(schema.users).values(data.users);
      console.log(`Imported ${data.users.length} users`);
    }

    // Import reservations
    if (data.reservations.length > 0) {
      await supabaseDb.insert(schema.reservations).values(data.reservations);
      console.log(`Imported ${data.reservations.length} reservations`);
    }

    // Import contact messages
    if (data.contactMessages.length > 0) {
      await supabaseDb.insert(schema.contactMessages).values(data.contactMessages);
      console.log(`Imported ${data.contactMessages.length} contact messages`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await supabasePool.end();
  }
}

async function migrateToSupabase() {
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!supabaseUrl) {
    throw new Error('SUPABASE_DATABASE_URL or DATABASE_URL must be set');
  }

  console.log('Starting migration to Supabase...');

  const data = await exportCurrentData();
  await importToSupabase(data, supabaseUrl);

  console.log('Migration completed! You can now update your DATABASE_URL to use Supabase.');
}

// Run migration if this file is executed directly
migrateToSupabase().catch(console.error);

export { migrateToSupabase };