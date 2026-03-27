import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtPayload } from '../models/auth.models.js';

// Extende o tipo Request do Express para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, env.JWT_SECRET);
    if (typeof verified === 'string') {
      throw new Error('Token inválido');
    }
    const payload = verified as unknown as JwtPayload;
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
