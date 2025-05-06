import { Request, Response } from 'express';
import { ServicoService } from '../services/ServicoService';
import { Servico } from '../models/Servico';

export class ServicoController {
  private service: ServicoService;

  constructor() {
    this.service = new ServicoService();
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const servicos = await this.service.findAll();
      return res.json(servicos);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const servico = await this.service.findById(id);
      
      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      return res.json(servico);
    } catch (error) {
      console.error('Erro ao buscar serviço por ID:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const servico: Servico = req.body;

      if (!servico.nome || !servico.descricao) {
        return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios' });
      }

      if (servico.preco <= 0) {
        return res.status(400).json({ error: 'Preço deve ser maior que zero' });
      }

      const novoServico = await this.service.create(servico);
      return res.status(201).json(novoServico);
    } catch (error: any) {
      if (error.message.includes('campos obrigatórios') ||
          error.message.includes('deve ser maior que zero')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao criar serviço:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const servico: Servico = req.body;

      if (!servico.nome || !servico.descricao) {
        return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios' });
      }

      if (servico.preco <= 0) {
        return res.status(400).json({ error: 'Preço deve ser maior que zero' });
      }

      const servicoAtualizado = await this.service.update(id, servico);
      return res.json(servicoAtualizado);
    } catch (error: any) {
      if (error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('campos obrigatórios') ||
          error.message.includes('deve ser maior que zero')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao atualizar serviço:', error);
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
      if (error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao excluir serviço:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findByAgendamentoId(req: Request, res: Response): Promise<Response> {
    try {
      const agendamentoId = parseInt(req.params.agendamentoId);
      
      if (isNaN(agendamentoId)) {
        return res.status(400).json({ error: 'ID do agendamento inválido' });
      }

      const servicos = await this.service.findByAgendamentoId(agendamentoId);
      return res.json(servicos);
    } catch (error) {
      console.error('Erro ao buscar serviços por agendamento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 