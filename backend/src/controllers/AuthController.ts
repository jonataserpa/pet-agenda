import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ClienteRepository } from '../repositories/ClienteRepository';
import bcrypt from 'bcrypt';

export class AuthController {
  private clienteRepository: ClienteRepository;

  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const cliente = await this.clienteRepository.findByEmail(email);

      if (!cliente) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha usando bcrypt
      const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerando token JWT
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
      const token = jwt.sign(
        { id: cliente.id, email: cliente.email },
        jwtSecret,
        { expiresIn: '8h' }
      );

      // Envia o token como cookie HTTP-only
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000, // 8 horas
        path: '/',
      });

      return res.json({
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  logout(req: Request, res: Response): Response {
    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Logout realizado' });
  }

  me(req: Request, res: Response): Response {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
    return res.json({ usuario: req.user });
  }
} 