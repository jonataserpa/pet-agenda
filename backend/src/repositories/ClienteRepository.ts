import { PrismaClient } from '@prisma/client';
import { Cliente } from '../models/Cliente';
import bcrypt from 'bcrypt';

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
    
    // Criptografar a senha
    const hashedSenha = await bcrypt.hash(clienteData.senha, 10);
    
    return this.prisma.cliente.create({
      data: {
        ...clienteData,
        senha: hashedSenha
      },
    });
  }

  async update(id: number, cliente: Cliente): Promise<Cliente> {
    const { pets, ...clienteData } = cliente;
    
    // Se a senha for fornecida, criptografá-la
    let dadosAtualizados = { ...clienteData };
    
    if (clienteData.senha) {
      const hashedSenha = await bcrypt.hash(clienteData.senha, 10);
      dadosAtualizados = { ...dadosAtualizados, senha: hashedSenha };
    }
    
    return this.prisma.cliente.update({
      where: { id },
      data: dadosAtualizados,
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