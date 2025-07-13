import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    (req as any).userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
