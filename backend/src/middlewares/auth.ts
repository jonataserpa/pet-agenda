import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient, StatusCliente } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

interface TokenPayload {
  id: number;
  email: string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Lê o token do cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    // Buscar dados completos do usuário no banco
    const cliente = await prisma.cliente.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        status: true
      }
    });

    if (!cliente) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Adiciona os dados completos do usuário na requisição
    req.user = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      status: cliente.status as StatusCliente | undefined
    };

    return next();
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Declaração para ampliar tipos do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        status?: StatusCliente;
      };
    }
  }
} 