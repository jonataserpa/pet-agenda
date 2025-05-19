import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  id: number;
  email: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Lê o token do cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    // Adiciona o ID e email do usuário na requisição para uso posterior
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Declaração para ampliar tipos do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
} 