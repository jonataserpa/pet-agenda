import { PrismaClient } from '@prisma/client';
import { Cliente } from '../models/Cliente';
import bcrypt from 'bcrypt';

function mapPrismaClienteToModel(prismaCliente: any): Cliente {
  if (!prismaCliente) return prismaCliente;
  return {
    ...prismaCliente,
    status: prismaCliente.status ?? undefined,
    observacao: prismaCliente.observacao ?? undefined,
  };
}

export class ClienteRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.prisma.cliente.findMany();
    return clientes.map(mapPrismaClienteToModel);
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
    });
    return mapPrismaClienteToModel(cliente);
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { email },
    });
    return mapPrismaClienteToModel(cliente);
  }

  async create(cliente: Cliente): Promise<Cliente> {
    const { pets, id, ...clienteData } = cliente;

    if (!clienteData.senha) {
      clienteData.senha = 'senha123';
    }

    // Garantir que 'observacao' seja uma string
    clienteData.observacao = clienteData.observacao || '';

    const hashedSenha = await bcrypt.hash(clienteData.senha, 10);
    
    const novoCliente = await this.prisma.cliente.create({
      data: {
        ...clienteData,
        senha: hashedSenha,
        observacao: clienteData.observacao || ''
      },
    });
    return mapPrismaClienteToModel(novoCliente);
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    const { pets, ...clienteData } = cliente;
    
    // Se a senha for fornecida, criptografá-la
    let dadosAtualizados = { ...clienteData };
    
    if (clienteData.senha) {
      const hashedSenha = await bcrypt.hash(clienteData.senha, 10);
      dadosAtualizados = { ...dadosAtualizados, senha: hashedSenha };
    }
    
    const clienteAtualizado = await this.prisma.cliente.update({
      where: { id },
      data: dadosAtualizados,
    });
    return mapPrismaClienteToModel(clienteAtualizado);
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.cliente.delete({
      where: { id },
    });
    return true;
  }

  async findWithPets(id: number): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { pets: true },
    });
    return mapPrismaClienteToModel(cliente);
  }
} 