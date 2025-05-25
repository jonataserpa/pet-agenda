import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de dados...');

  // Limpar dados existentes
  await prisma.agendamentoServico.deleteMany({});
  await prisma.agendamento.deleteMany({});
  await prisma.servico.deleteMany({});
  await prisma.pet.deleteMany({});
  await prisma.cliente.deleteMany({});

  console.log('Dados antigos removidos.');

  // Criptografar senha padrão para todos os clientes
  const senhaComum = await bcrypt.hash('senha123', 10);

  // Criar clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-1111',
      senha: senhaComum,
      observacao: 'Cliente de teste'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: 'Maria Souza',
      email: 'maria@email.com',
      telefone: '(11) 99999-2222',
      senha: senhaComum,
      observacao: 'Cliente de teste'
    }
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      telefone: '(11) 99999-3333',
      senha: senhaComum,
      observacao: 'Cliente de teste'
    }
  });

  console.log('Clientes criados:', { cliente1, cliente2, cliente3 });

  // Criar pets
  const pet1 = await prisma.pet.create({
    data: {
      nome: 'Rex',
      especie: 'Cachorro',
      raca: 'Labrador',
      idade: 3,
      peso: 15,
      clienteId: cliente1.id
    }
  });

  const pet2 = await prisma.pet.create({
    data: {
      nome: 'Nina',
      especie: 'Gato',
      raca: 'Siamês',
      idade: 2,
      peso: 4,
      clienteId: cliente1.id
    }
  });

  const pet3 = await prisma.pet.create({
    data: {
      nome: 'Thor',
      especie: 'Cachorro',
      raca: 'Golden Retriever',
      idade: 5,
      peso: 25,
      clienteId: cliente2.id
    }
  });

  const pet4 = await prisma.pet.create({
    data: {
      nome: 'Mel',
      especie: 'Cachorro',
      raca: 'Poodle',
      idade: 4,
      peso: 8,
      clienteId: cliente3.id
    }
  });

  console.log('Pets criados:', { pet1, pet2, pet3, pet4 });

  // Criar serviços
  const servico1 = await prisma.servico.create({
    data: {
      nome: 'Banho',
      descricao: 'Banho completo com shampoo especial',
      preco: 50.0
    }
  });

  const servico2 = await prisma.servico.create({
    data: {
      nome: 'Tosa',
      descricao: 'Tosa higiênica e estética',
      preco: 70.0
    }
  });

  const servico3 = await prisma.servico.create({
    data: {
      nome: 'Banho e Tosa',
      descricao: 'Pacote completo de banho e tosa',
      preco: 100.0
    }
  });

  const servico4 = await prisma.servico.create({
    data: {
      nome: 'Hidratação',
      descricao: 'Tratamento de hidratação para pelos',
      preco: 40.0
    }
  });

  console.log('Serviços criados:', { servico1, servico2, servico3, servico4 });

  // Criar agendamentos
  const agora = new Date();
  
  const agendamento1 = await prisma.agendamento.create({
    data: {
      data: new Date(agora.setDate(agora.getDate() + 1)),
      status: 'AGENDADO',
      observacao: 'Agendamento de teste',
      petId: pet1.id
    }
  });

  const agendamento2 = await prisma.agendamento.create({
    data: {
      data: new Date(agora.setDate(agora.getDate() + 1)),
      status: 'AGENDADO',
      observacao: 'Agendamento de teste',
      petId: pet3.id
    }
  });

  const agendamento3 = await prisma.agendamento.create({
    data: {
      data: new Date(agora.setDate(agora.getDate() + 2)),
      status: 'AGENDADO',
      observacao: 'Agendamento de teste',
      petId: pet2.id
    }
  });

  const agendamento4 = await prisma.agendamento.create({
    data: {
      data: new Date(agora.setDate(agora.getDate() - 5)),
      status: 'CONCLUIDO',
      observacao: 'Agendamento de teste',
      petId: pet4.id
    }
  });

  console.log('Agendamentos criados:', { agendamento1, agendamento2, agendamento3, agendamento4 });

  // Associar serviços aos agendamentos
  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento1.id,
      servicoId: servico1.id
    }
  });

  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento1.id,
      servicoId: servico2.id
    }
  });

  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento2.id,
      servicoId: servico3.id
    }
  });

  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento3.id,
      servicoId: servico1.id
    }
  });

  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento4.id,
      servicoId: servico3.id
    }
  });

  await prisma.agendamentoServico.create({
    data: {
      agendamentoId: agendamento4.id,
      servicoId: servico4.id
    }
  });

  console.log('Associações entre agendamentos e serviços criadas.');
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 