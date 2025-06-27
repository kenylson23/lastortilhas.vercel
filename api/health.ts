import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'OK',
      service: 'Las Tortilhas API',
      timestamp: Date.now()
    });
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}