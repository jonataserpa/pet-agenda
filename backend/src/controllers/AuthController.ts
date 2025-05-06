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

      // No contexto deste sistema, vamos simplificar e autenticar direto com o email
      // Em um sistema real, adicionaríamos um campo de senha na tabela de Cliente
      const cliente = await this.clienteRepository.findByEmail(email);

      if (!cliente) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Em um sistema real, faríamos a verificação da senha com bcrypt
      // const senhaCorreta = await bcrypt.compare(senha, cliente.senhaCriptografada);
      // if (!senhaCorreta) {
      //   return res.status(401).json({ error: 'Credenciais inválidas' });
      // }

      // Gerando token JWT
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
      const token = jwt.sign(
        { id: cliente.id, email: cliente.email },
        jwtSecret,
        { expiresIn: '8h' }
      );

      return res.json({
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 