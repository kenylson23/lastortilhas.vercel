import { Request, Response } from 'express';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Configure for Vercel
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
let routesInitialized = false;

async function initializeApp() {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
  return app;
}

export default async function handler(req: Request, res: Response) {
  const app = await initializeApp();
  return app(req, res);
}