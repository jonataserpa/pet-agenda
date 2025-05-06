import { Servico } from '../models/Servico';
import { ServicoRepository } from '../repositories/ServicoRepository';

export class ServicoService {
  private repository: ServicoRepository;

  constructor() {
    this.repository = new ServicoRepository();
  }

  async findAll(): Promise<Servico[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Servico | null> {
    return this.repository.findById(id);
  }

  async create(servico: Servico): Promise<Servico> {
    // Validar campos obrigatórios
    if (!servico.nome || !servico.descricao) {
      throw new Error('Nome e descrição são campos obrigatórios');
    }

    // Validar preço
    if (servico.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    return this.repository.create(servico);
  }

  async update(id: number, servico: Servico): Promise<Servico> {
    // Verificar se o serviço existe
    const servicoExistente = await this.repository.findById(id);
    if (!servicoExistente) {
      throw new Error('Serviço não encontrado');
    }

    // Validar campos obrigatórios
    if (!servico.nome || !servico.descricao) {
      throw new Error('Nome e descrição são campos obrigatórios');
    }

    // Validar preço
    if (servico.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }

    return this.repository.update(id, servico);
  }

  async delete(id: number): Promise<boolean> {
    // Verificar se o serviço existe
    const servicoExistente = await this.repository.findById(id);
    if (!servicoExistente) {
      throw new Error('Serviço não encontrado');
    }

    return this.repository.delete(id);
  }

  async findByAgendamentoId(agendamentoId: number): Promise<Servico[]> {
    return this.repository.findByAgendamentoId(agendamentoId);
  }
} 