-- Inserir dados na tabela Cliente
INSERT INTO clientes (nome, email, telefone, senha, status, observacao) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-9999', 'senha123', 'ATIVO', 'Cliente regular'),
('Maria Oliveira', 'maria.oliveira@email.com', '(21) 88888-8888', 'senha123', 'ATIVO', 'Cliente VIP');

-- Inserir dados na tabela Pet
INSERT INTO pets (nome, especie, raca, idade, peso, clienteId) VALUES
('Rex', 'Cachorro', 'Labrador', 5, 30, 1),
('Mimi', 'Gato', 'Siamês', 3, 5, 2);

-- Inserir dados na tabela Servico
INSERT INTO servicos (nome, preco, descricao) VALUES
('Banho', 50.00, 'Banho completo com produtos especiais'),
('Tosa', 70.00, 'Tosa completa e estilosa');

-- Inserir dados na tabela Agendamento
INSERT INTO agendamentos (data, status, observacao, petId) VALUES
('2023-12-01 10:00:00', 'AGENDADO', 'Primeira visita', 1),
('2023-12-02 14:00:00', 'AGENDADO', 'Cliente VIP', 2);

-- Inserir dados na tabela AgendamentoServico
INSERT INTO agendamento_servicos (agendamentoId, servicoId) VALUES
(1, 1),
(2, 2); 