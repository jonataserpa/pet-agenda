import { PrismaClient } from '@prisma/client';
import { Pet } from '../models/Pet';

function mapPrismaClienteToModel(prismaCliente: any) {
  if (!prismaCliente) return prismaCliente;
  return {
    ...prismaCliente,
    status: prismaCliente.status ?? undefined,
    observacao: prismaCliente.observacao ?? undefined,
  };
}

export class PetRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Pet[]> {
    return this.prisma.pet.findMany();
  }

  async findById(id: number): Promise<Pet | null> {
    return this.prisma.pet.findUnique({
      where: { id },
    });
  }

  async findByClienteId(clienteId: number): Promise<Pet[]> {
    return this.prisma.pet.findMany({
      where: { clienteId },
    });
  }

  async create(pet: Pet): Promise<Pet> {
    const { cliente, agendamentos, ...petData } = pet;
    
    return this.prisma.pet.create({
      data: petData,
    });
  }

  async update(id: number, pet: Pet): Promise<Pet> {
    const { cliente, agendamentos, ...petData } = pet;
    
    return this.prisma.pet.update({
      where: { id },
      data: {
        ...petData,
        id: Number(petData.id), // Certifique-se de que o id é um número
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.pet.delete({
      where: { id },
    });
    return true;
  }

  async findWithCliente(id: number): Promise<Pet | null> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: { cliente: true },
    });
    if (!pet) return pet;
    return {
      ...pet,
      cliente: mapPrismaClienteToModel(pet.cliente),
    };
  }

  async findWithAgendamentos(id: number): Promise<Pet | null> {
    return this.prisma.pet.findUnique({
      where: { id },
      include: { agendamentos: true },
    });
  }
} 