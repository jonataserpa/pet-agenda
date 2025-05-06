import { Request, Response } from 'express';
import { ClienteService } from '../services/ClienteService';
import { Cliente } from '../models/Cliente';

export class ClienteController {
  private service: ClienteService;

  constructor() {
    this.service = new ClienteService();
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const clientes = await this.service.findAll();
      return res.json(clientes);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const cliente = await this.service.findById(id);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.json(cliente);
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const cliente: Cliente = req.body;

      if (!cliente.nome || !cliente.email || !cliente.telefone) {
        return res.status(400).json({ error: 'Nome, e-mail e telefone são campos obrigatórios' });
      }

      const novoCliente = await this.service.create(cliente);
      return res.status(201).json(novoCliente);
    } catch (error: any) {
      if (error.message.includes('já existe um cliente com este e-mail') || 
          error.message.includes('obrigatórios') ||
          error.message.includes('formato de e-mail')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao criar cliente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const cliente: Cliente = req.body;

      if (!cliente.nome || !cliente.email || !cliente.telefone) {
        return res.status(400).json({ error: 'Nome, e-mail e telefone são campos obrigatórios' });
      }

      const clienteAtualizado = await this.service.update(id, cliente);
      return res.json(clienteAtualizado);
    } catch (error: any) {
      if (error.message.includes('Cliente não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('já existe um cliente com este e-mail') || 
          error.message.includes('obrigatórios') ||
          error.message.includes('formato de e-mail')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao atualizar cliente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await this.service.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('Cliente não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao excluir cliente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findWithPets(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const cliente = await this.service.findWithPets(id);
      return res.json(cliente);
    } catch (error: any) {
      if (error.message.includes('Cliente não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar cliente com pets:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 