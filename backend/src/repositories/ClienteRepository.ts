import { PrismaClient } from '@prisma/client';
import { Cliente } from '../models/Cliente';

export class ClienteRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany();
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { email },
    });
  }

  async create(cliente: Cliente): Promise<Cliente> {
    const { pets, ...clienteData } = cliente;
    
    return this.prisma.cliente.create({
      data: clienteData,
    });
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    const { pets, ...clienteData } = cliente;
    
    return this.prisma.cliente.update({
      where: { id },
      data: clienteData,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.cliente.delete({
      where: { id },
    });
    return true;
  }

  async findWithPets(id: number): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: { pets: true },
    });
  }
} 