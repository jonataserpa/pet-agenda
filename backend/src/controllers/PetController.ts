import { Request, Response } from 'express';
import { PetService } from '../services/PetService';
import { Pet } from '../models/Pet';

export class PetController {
  private service: PetService;

  constructor() {
    this.service = new PetService();
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const pets = await this.service.findAll();
      return res.json(pets);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const pet = await this.service.findById(id);
      
      if (!pet) {
        return res.status(404).json({ error: 'Pet não encontrado' });
      }

      return res.json(pet);
    } catch (error) {
      console.error('Erro ao buscar pet por ID:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findByClienteId(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = parseInt(req.params.clienteId);
      
      if (isNaN(clienteId)) {
        return res.status(400).json({ error: 'ID do cliente inválido' });
      }

      const pets = await this.service.findByClienteId(clienteId);
      return res.json(pets);
    } catch (error: any) {
      if (error.message.includes('Cliente não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar pets por cliente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const pet: Pet = req.body;

      if (!pet.nome || !pet.especie || !pet.raca || !pet.clienteId) {
        return res.status(400).json({ error: 'Nome, espécie, raça e ID do cliente são campos obrigatórios' });
      }

      const novoPet = await this.service.create(pet);
      return res.status(201).json(novoPet);
    } catch (error: any) {
      if (error.message.includes('Cliente não encontrado') ||
          error.message.includes('campos obrigatórios') ||
          error.message.includes('não pode ser negativa') ||
          error.message.includes('deve ser maior que zero')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao criar pet:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const pet: Pet = req.body;

      if (!pet.nome || !pet.especie || !pet.raca || !pet.clienteId) {
        return res.status(400).json({ error: 'Nome, espécie, raça e ID do cliente são campos obrigatórios' });
      }

      const petAtualizado = await this.service.update(id, pet);
      return res.json(petAtualizado);
    } catch (error: any) {
      if (error.message.includes('Pet não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Cliente não encontrado') ||
          error.message.includes('campos obrigatórios') ||
          error.message.includes('não pode ser negativa') ||
          error.message.includes('deve ser maior que zero')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Erro ao atualizar pet:', error);
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
      if (error.message.includes('Pet não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao excluir pet:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findWithCliente(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const pet = await this.service.findWithCliente(id);
      return res.json(pet);
    } catch (error: any) {
      if (error.message.includes('Pet não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar pet com cliente:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async findWithAgendamentos(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const pet = await this.service.findWithAgendamentos(id);
      return res.json(pet);
    } catch (error: any) {
      if (error.message.includes('Pet não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erro ao buscar pet com agendamentos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 