import { Cliente } from '../models/Cliente';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class ClienteService {
  private repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  async findAll(): Promise<Cliente[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.repository.findById(id);
  }

  async create(cliente: Cliente): Promise<Cliente> {
    // Validar se já existe um cliente com o mesmo e-mail
    const clienteExistente = await this.repository.findByEmail(cliente.email);
    if (clienteExistente) {
      throw new Error('Já existe um cliente com este e-mail');
    }

    // Validar campos obrigatórios
    if (!cliente.nome || !cliente.email || !cliente.telefone) {
      throw new Error('Nome, e-mail e telefone são campos obrigatórios');
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      throw new Error('Formato de e-mail inválido');
    }

    return this.repository.create(cliente);
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    // Verificar se o cliente existe
    const clienteExistente = await this.repository.findById(id);
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    // Verificar se o e-mail já existe (se estiver sendo alterado)
    if (cliente.email !== clienteExistente.email) {
      const clienteComMesmoEmail = await this.repository.findByEmail(cliente.email);
      if (clienteComMesmoEmail) {
        throw new Error('Já existe um cliente com este e-mail');
      }
    }

    // Validar campos obrigatórios
    if (!cliente.nome || !cliente.email || !cliente.telefone) {
      throw new Error('Nome, e-mail e telefone são campos obrigatórios');
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      throw new Error('Formato de e-mail inválido');
    }

    return this.repository.update(id, cliente);
  }

  async delete(id: number): Promise<boolean> {
    // Verificar se o cliente existe
    const clienteExistente = await this.repository.findById(id);
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }

    return this.repository.delete(id);
  }

  async findWithPets(id: number): Promise<Cliente | null> {
    const cliente = await this.repository.findWithPets(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente;
  }
} 