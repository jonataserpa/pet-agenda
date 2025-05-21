import { Agendamento } from '../models/Agendamento';
import { AgendamentoRepository } from '../repositories/AgendamentoRepository';
import { PetRepository } from '../repositories/PetRepository';
import { ServicoRepository } from '../repositories/ServicoRepository';

export class AgendamentoService {
  private repository: AgendamentoRepository;
  private petRepository: PetRepository;
  private servicoRepository: ServicoRepository;

  constructor() {
    this.repository = new AgendamentoRepository();
    this.petRepository = new PetRepository();
    this.servicoRepository = new ServicoRepository();
  }

  async findAll(): Promise<Agendamento[]> {
    // Buscar todos os agendamentos com detalhes de pets e serviços
    const agendamentos = await this.repository.findAll();
    console.log(`AgendamentoService: Retornando ${agendamentos.length} agendamentos com detalhes de pets e serviços`);
    return agendamentos;
  }

  async findById(id: number): Promise<Agendamento | null> {
    return this.repository.findById(id);
  }

  async findByPetId(petId: number): Promise<Agendamento[]> {
    // Verificar se o pet existe
    const pet = await this.petRepository.findById(petId);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    return this.repository.findByPetId(petId);
  }

  async create(agendamento: Agendamento): Promise<Agendamento> {
    // Validar se o pet existe
    const pet = await this.petRepository.findById(agendamento.petId);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    // Validar campos obrigatórios
    if (!agendamento.data || !agendamento.status) {
      throw new Error('Data e status são campos obrigatórios');
    }

    // Validar status válido
    const statusValidos = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
    if (!statusValidos.includes(agendamento.status.toUpperCase())) {
      throw new Error('Status inválido. Valores válidos: AGENDADO, CONCLUIDO, CANCELADO');
    }

    // Verificar se já existe um agendamento na mesma data
    const agendamentosNaData = await this.repository.findAll();
    const dataAgendamento = new Date(agendamento.data);
    
    const conflito = agendamentosNaData.some(ag => {
      const dataExistente = new Date(ag.data);
      return (
        dataExistente.getFullYear() === dataAgendamento.getFullYear() &&
        dataExistente.getMonth() === dataAgendamento.getMonth() &&
        dataExistente.getDate() === dataAgendamento.getDate() &&
        dataExistente.getHours() === dataAgendamento.getHours()
      );
    });

    if (conflito) {
      throw new Error('Já existe um agendamento nesta data e horário');
    }

    // Padronizar o status para maiúsculas
    agendamento.status = agendamento.status.toUpperCase();

    return this.repository.create(agendamento);
  }

  async update(id: number, agendamento: Agendamento): Promise<Agendamento> {
    // Verificar se o agendamento existe
    const agendamentoExistente = await this.repository.findById(id);
    if (!agendamentoExistente) {
      throw new Error('Agendamento não encontrado');
    }

    // Se estiver alterando o pet, verificar se o novo pet existe
    if (agendamento.petId !== agendamentoExistente.petId) {
      const pet = await this.petRepository.findById(agendamento.petId);
      if (!pet) {
        throw new Error('Pet não encontrado');
      }
    }

    // Validar campos obrigatórios
    if (!agendamento.data || !agendamento.status) {
      throw new Error('Data e status são campos obrigatórios');
    }

    // Validar status válido
    const statusValidos = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
    if (!statusValidos.includes(agendamento.status.toUpperCase())) {
      throw new Error('Status inválido. Valores válidos: AGENDADO, CONCLUIDO, CANCELADO');
    }

    // Se estiver alterando a data, verificar conflitos
    if (agendamento.data.toString() !== agendamentoExistente.data.toString()) {
      const agendamentosNaData = await this.repository.findAll();
      const dataAgendamento = new Date(agendamento.data);
      
      const conflito = agendamentosNaData.some(ag => {
        if (ag.id === id) return false; // Ignorar o próprio agendamento
        
        const dataExistente = new Date(ag.data);
        return (
          dataExistente.getFullYear() === dataAgendamento.getFullYear() &&
          dataExistente.getMonth() === dataAgendamento.getMonth() &&
          dataExistente.getDate() === dataAgendamento.getDate() &&
          dataExistente.getHours() === dataAgendamento.getHours()
        );
      });

      if (conflito) {
        throw new Error('Já existe um agendamento nesta data e horário');
      }
    }

    // Padronizar o status para maiúsculas
    agendamento.status = agendamento.status.toUpperCase();

    return this.repository.update(id, agendamento);
  }

  async delete(id: number): Promise<boolean> {
    // Verificar se o agendamento existe
    const agendamentoExistente = await this.repository.findById(id);
    if (!agendamentoExistente) {
      throw new Error('Agendamento não encontrado');
    }

    return this.repository.delete(id);
  }

  async findWithPet(id: number): Promise<Agendamento | null> {
    const agendamento = await this.repository.findWithPet(id);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }
    return agendamento;
  }

  async findWithServicos(id: number): Promise<Agendamento | null> {
    const agendamento = await this.repository.findWithServicos(id);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }
    return agendamento;
  }

  async addServico(agendamentoId: number, servicoId: number): Promise<boolean> {
    // Verificar se o agendamento existe
    const agendamento = await this.repository.findById(agendamentoId);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    // Verificar se o serviço existe
    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    return this.repository.addServico(agendamentoId, servicoId);
  }

  async removeServico(agendamentoId: number, servicoId: number): Promise<boolean> {
    // Verificar se o agendamento existe
    const agendamento = await this.repository.findById(agendamentoId);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    // Verificar se o serviço existe
    const servico = await this.servicoRepository.findById(servicoId);
    if (!servico) {
      throw new Error('Serviço não encontrado');
    }

    return this.repository.removeServico(agendamentoId, servicoId);
  }
} 