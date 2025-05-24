import { PrismaClient } from '@prisma/client';
import { Agendamento } from '../models/Agendamento';

export class AgendamentoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<Agendamento[]> {
    // Buscar todos os agendamentos com seus pets
    const agendamentos = await this.prisma.agendamento.findMany({
      include: {
        pet: true, // Incluir os dados do pet
        agendamentoServicos: { // Incluir os serviços associados
          include: {
            servico: true
          }
        }
      }
    });

    // Transformar os dados para o formato esperado pelo cliente
    return agendamentos.map(agendamento => {
      // Extrair os serviços do relacionamento
      const servicos = agendamento.agendamentoServicos.map(as => as.servico);
      
      // Desestruturar para remover o campo original e criar uma nova estrutura
      const { agendamentoServicos, ...agendamentoData } = agendamento;
      
      // Retornar o agendamento com os serviços em formato plano
      return {
        ...agendamentoData,
        servicos
      };
    });
  }

  async findById(id: number): Promise<Agendamento | null> {
    return this.prisma.agendamento.findUnique({
      where: { id },
    });
  }

  async findByPetId(petId: number): Promise<Agendamento[]> {
    return this.prisma.agendamento.findMany({
      where: { petId },
    });
  }

  async create(agendamento: Agendamento): Promise<Agendamento> {
    const { pet, servicos, ...agendamentoData } = agendamento;

    return this.prisma.agendamento.create({
      data: {   
        ...agendamentoData,
        observacao: agendamentoData.observacao || ''
       }
    });
  }

  async update(id: number, agendamento: Agendamento): Promise<Agendamento> {
    const { pet, servicos, id: agendamentoId, ...agendamentoData } = agendamento;
    
    // Garantir que observacao seja uma string
    agendamentoData.observacao = agendamentoData.observacao || '';
    
    return this.prisma.agendamento.update({
      where: { id },
      data: agendamentoData,
    });
  }

  async delete(id: number): Promise<boolean> {
    // Remover todas as referências na tabela AgendamentoServico
    await this.prisma.agendamentoServico.deleteMany({
      where: { agendamentoId: id },
    });

    // Agora, excluir o agendamento
    await this.prisma.agendamento.delete({
      where: { id },
    });
    return true;
  }

  async findWithPet(id: number): Promise<Agendamento | null> {
    return this.prisma.agendamento.findUnique({
      where: { id },
      include: { pet: true },
    });
  }

  async findWithServicos(id: number): Promise<Agendamento | null> {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
    });

    if (!agendamento) return null;

    const agendamentoServicos = await this.prisma.agendamentoServico.findMany({
      where: { agendamentoId: id },
      include: { servico: true },
    });

    const servicos = agendamentoServicos.map((as: any) => as.servico);

    return {
      ...agendamento,
      servicos,
    };
  }

  async addServico(agendamentoId: number, servicoId: number): Promise<boolean> {
    await this.prisma.agendamentoServico.create({
      data: {
        agendamentoId,
        servicoId,
      },
    });
    return true;
  }

  async removeServico(agendamentoId: number, servicoId: number): Promise<boolean> {
    await this.prisma.agendamentoServico.delete({
      where: {
        agendamentoId_servicoId: {
          agendamentoId,
          servicoId,
        },
      },
    });
    return true;
  }
} 