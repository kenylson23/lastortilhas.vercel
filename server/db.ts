import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { getDeploymentConfig } from "./config";

// Usar configuração flexível de deployment
const config = getDeploymentConfig();

export const pool = new Pool({ 
  connectionString: config.database.url,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  max: config.database.poolSize,
  min: parseInt(process.env.DB_POOL_MIN || '1'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
});

export const db = drizzle(pool, { schema });