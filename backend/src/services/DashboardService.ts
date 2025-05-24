import { PrismaClient } from '@prisma/client';

export class DashboardService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getDashboardData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch today's appointments and sum their service prices
    const agendamentosHoje = await this.prisma.agendamento.findMany({
      where: {
        data: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        agendamentoServicos: {
          include: {
            servico: true,
          },
        },
      },
    });

    const totalDinheiroHoje = agendamentosHoje.reduce((total, agendamento) => {
      const totalServicos = agendamento.agendamentoServicos.reduce((sum, agendamentoServico) => {
        return sum + agendamentoServico.servico.preco;
      }, 0);
      return total + totalServicos;
    }, 0);

    const totalNovosClientes = await this.prisma.cliente.count();
    const totalAgendamentos = await this.prisma.agendamento.count();
    const totalPets = await this.prisma.pet.count();

    const ultimosAgendamentos = await this.prisma.agendamento.findMany({
      orderBy: {
        data: 'desc',
      },
      take: 5,
      include: {
        pet: {
          include: {
            cliente: true,
          },
        },
      },
    });

    const proximosAgendamentos = await this.prisma.agendamento.findMany({
      orderBy: {
        data: 'asc',
      },
      take: 5,
      include: {
        pet: {
          include: {
            cliente: true,
          },
        },
      },
    });

    return {
      totalDinheiroHoje,
      totalNovosClientes,
      totalAgendamentos,
      totalPets,
      ultimosAgendamentos: ultimosAgendamentos.map(agendamento => ({
        id: agendamento.id,
        data: agendamento.data,
        petName: agendamento.pet.nome,
        clientName: agendamento.pet.cliente.nome,
      })),
      proximosAgendamentos: proximosAgendamentos.map(agendamento => ({
        id: agendamento.id,
        data: agendamento.data,
        petName: agendamento.pet.nome,
        clientName: agendamento.pet.cliente.nome,
      })),
    };
  }
} 