import { Pet } from '../models/Pet';
import { PetRepository } from '../repositories/PetRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class PetService {
  private repository: PetRepository;
  private clienteRepository: ClienteRepository;

  constructor() {
    this.repository = new PetRepository();
    this.clienteRepository = new ClienteRepository();
  }

  async findAll(): Promise<Pet[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Pet | null> {
    return this.repository.findById(id);
  }

  async findByClienteId(clienteId: number): Promise<Pet[]> {
    // Verificar se o cliente existe
    const cliente = await this.clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    return this.repository.findByClienteId(clienteId);
  }

  async create(pet: Pet): Promise<Pet> {
    // Verificar se o cliente existe
    const cliente = await this.clienteRepository.findById(pet.clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Validar campos obrigatórios
    if (!pet.nome || !pet.especie || !pet.raca) {
      throw new Error('Nome, espécie e raça são campos obrigatórios');
    }

    // Validar valores de idade e peso
    if (pet.idade < 0) {
      throw new Error('Idade não pode ser negativa');
    }

    if (pet.peso <= 0) {
      throw new Error('Peso deve ser maior que zero');
    }

    return this.repository.create(pet);
  }

  async update(id: number, pet: Pet): Promise<Pet> {
    // Verificar se o pet existe
    const petExistente = await this.repository.findById(id);
    if (!petExistente) {
      throw new Error('Pet não encontrado');
    }

    // Se o clienteId estiver sendo alterado, verificar se o cliente existe
    if (pet.clienteId !== petExistente.clienteId) {
      const cliente = await this.clienteRepository.findById(pet.clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
    }

    // Validar campos obrigatórios
    if (!pet.nome || !pet.especie || !pet.raca) {
      throw new Error('Nome, espécie e raça são campos obrigatórios');
    }

    // Validar valores de idade e peso
    if (pet.idade < 0) {
      throw new Error('Idade não pode ser negativa');
    }

    if (pet.peso <= 0) {
      throw new Error('Peso deve ser maior que zero');
    }

    return this.repository.update(id, pet);
  }

  async delete(id: number): Promise<boolean> {
    // Verificar se o pet existe
    const petExistente = await this.repository.findById(id);
    if (!petExistente) {
      throw new Error('Pet não encontrado');
    }

    return this.repository.delete(id);
  }

  async findWithCliente(id: number): Promise<Pet | null> {
    const pet = await this.repository.findWithCliente(id);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }
    return pet;
  }

  async findWithAgendamentos(id: number): Promise<Pet | null> {
    const pet = await this.repository.findWithAgendamentos(id);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }
    return pet;
  }
} 