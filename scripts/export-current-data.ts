import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

async function exportCurrentData() {
  const currentPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const currentDb = drizzle(currentPool, { schema });

  console.log('Exporting current data from Replit database...');

  try {
    // Get menu categories
    const menuCategories = await currentDb.query.menuCategories.findMany();
    console.log(`Found ${menuCategories.length} menu categories`);

    // Get menu items  
    const menuItems = await currentDb.query.menuItems.findMany();
    console.log(`Found ${menuItems.length} menu items`);

    // Get users
    const users = await currentDb.query.users.findMany();
    console.log(`Found ${users.length} users`);

    // Get reservations
    const reservations = await currentDb.query.reservations.findMany();
    console.log(`Found ${reservations.length} reservations`);

    await currentPool.end();

    return {
      menuCategories,
      menuItems,
      users,
      reservations,
    };
  } catch (error) {
    console.error('Export failed:', error);
    await currentPool.end();
    throw error;
  }
}

exportCurrentData()
  .then(data => {
    console.log('Export completed successfully!');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(console.error);