import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Use the same database configuration as the main app
import { pool } from './db';

// Re-export the pool for direct SQL operations

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  password?: string;
}

export async function createUserDirect(userData: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}): Promise<AuthUser> {
  const client = await pool.connect();
  try {
    // Debug: Log the parameters being passed
    console.log('Creating user with data:', {
      id: userData.email,
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user'
    });

    const result = await client.query(`
      INSERT INTO users (id, email, username, password, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role
      RETURNING id, email, username, first_name, last_name, role, password
    `, [
      userData.email, // id
      userData.email,
      userData.username,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.role || 'user'
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error in createUserDirect:', error);
    console.error('Parameters:', [
      userData.email,
      userData.email,
      userData.username,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.role || 'user'
    ]);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByEmailDirect(email: string): Promise<AuthUser | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, email, username, first_name, last_name, role, password
      FROM users WHERE email = $1
    `, [email]);

    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}