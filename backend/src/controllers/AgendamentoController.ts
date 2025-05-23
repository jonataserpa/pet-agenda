import { Request, Response } from 'express';
import { AgendamentoService } from '../services/AgendamentoService';
import { Agendamento } from '../models/Agendamento';

export class AgendamentoController {
  private service: AgendamentoService;

  constructor() {
    this.service = new AgendamentoService();
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      console.log('AgendamentoController: Buscando todos os agendamentos com seus serviços');
      const agendamentos = await this.service.findAll();
      console.log(`AgendamentoController: Encontrados ${agendamentos.length} agendamentos`);

      // Log para depuração (exemplo do primeiro agendamento)
      if (agendamentos.length > 0) {
        console.log('AgendamentoController: Exemplo do primeiro agendamento:', {
          id: agendamentos[0].id,
          data: agendamentos[0].data,
          petId: agendamentos[0].petId,
          observacao: agendamentos[0].observacao,
          pet: agendamentos[0].pet ? {
            id: agendamentos[0].pet.id,
            nome: agendamentos[0].pet.nome
          } : null,
          servicos: agendamentos[0].servicos ?
            agendamentos[0].servicos.map(s => ({ id: s.id, nome: s.nome, preco: s.preco })) :
            []
        });
      }

      return res.json(agendamentos);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const agendamento = await this.service.findById(id);

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      return res.json(agendamento);
    } catch (error) {
      console.error('Erro ao buscar agendamento por ID:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findByPetId(req: Request, res: Response): Promise<Response> {
    try {
      const petId = parseInt(req.params.petId);

      if (isNaN(petId)) {
        return res.status(400).json({ error: 'ID do pet inválido' });
      }

      const agendamentos = await this.service.findByPetId(petId);
      return res.json(agendamentos);
    } catch (error: any) {
      if (error.message.includes('Pet não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar agendamentos por pet:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const agendamento: Agendamento = req.body;

      if (!agendamento.data || !agendamento.status || !agendamento.petId) {
        return res.status(400).json({ error: 'Data, status e ID do pet são campos obrigatórios' });
      }

      const novoAgendamento = await this.service.create(agendamento);
      return res.status(201).json(novoAgendamento);
    } catch (error: any) {
      if (error.message.includes('Pet não encontrado') ||
        error.message.includes('campos obrigatórios') ||
        error.message.includes('Status inválido') ||
        error.message.includes('Já existe um agendamento')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao criar agendamento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const agendamento: Agendamento = req.body;

      if (!agendamento.data || !agendamento.status || !agendamento.petId) {
        return res.status(400).json({ error: 'Data, status e ID do pet são campos obrigatórios' });
      }

      const agendamentoAtualizado = await this.service.update(id, agendamento);
      return res.json(agendamentoAtualizado);
    } catch (error: any) {
      if (error.message.includes('Agendamento não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Pet não encontrado') ||
        error.message.includes('campos obrigatórios') ||
        error.message.includes('Status inválido') ||
        error.message.includes('Já existe um agendamento')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao atualizar agendamento:', error);
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
      if (error.message.includes('Agendamento não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao excluir agendamento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findWithPet(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const agendamento = await this.service.findWithPet(id);
      return res.json(agendamento);
    } catch (error: any) {
      if (error.message.includes('Agendamento não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar agendamento com pet:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findWithServicos(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const agendamento = await this.service.findWithServicos(id);
      return res.json(agendamento);
    } catch (error: any) {
      if (error.message.includes('Agendamento não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar agendamento com serviços:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async addServico(req: Request, res: Response): Promise<Response> {
    try {
      const agendamentoId = parseInt(req.params.id);
      const { servicoId } = req.body;

      if (isNaN(agendamentoId) || isNaN(servicoId)) {
        return res.status(400).json({ error: 'IDs inválidos' });
      }

      await this.service.addServico(agendamentoId, servicoId);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('Agendamento não encontrado') ||
        error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao adicionar serviço ao agendamento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async removeServico(req: Request, res: Response): Promise<Response> {
    try {
      const agendamentoId = parseInt(req.params.id);
      const servicoId = parseInt(req.params.servicoId);

      if (isNaN(agendamentoId) || isNaN(servicoId)) {
        return res.status(400).json({ error: 'IDs inválidos' });
      }

      await this.service.removeServico(agendamentoId, servicoId);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('Agendamento não encontrado') ||
        error.message.includes('Serviço não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao remover serviço do agendamento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 