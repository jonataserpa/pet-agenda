import { PrismaClient } from '@prisma/client';
import { Servico } from '../models/Servico';

export class ServicoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Servico[]> {
    return this.prisma.servico.findMany();
  }

  async findById(id: number): Promise<Servico | null> {
    return this.prisma.servico.findUnique({
      where: { id },
    });
  }

  async create(servico: Servico): Promise<Servico> {
    const { agendamentos, ...servicoData } = servico;
    
    return this.prisma.servico.create({
      data: servicoData,
    });
  }

  async update(id: number, servico: Servico): Promise<Servico> {
    const { agendamentos, ...servicoData } = servico;
    
    return this.prisma.servico.update({
      where: { id },
      data: servicoData,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.servico.delete({
      where: { id },
    });
    return true;
  }

  async findByAgendamentoId(agendamentoId: number): Promise<Servico[]> {
    const agendamentoServicos = await this.prisma.agendamentoServico.findMany({
      where: { agendamentoId },
      include: { servico: true },
    });

    return agendamentoServicos.map((as: any) => as.servico);
  }
} 