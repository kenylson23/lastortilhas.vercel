import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    message: 'Las Tortilhas API - Vercel Deployment',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}