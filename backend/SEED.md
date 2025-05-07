# Seed de Dados para Testes

Este documento explica como popular o banco de dados com dados de teste usando o script de seed.

## Como executar o seed

Para popular o banco de dados com os dados de teste, execute o seguinte comando:

```bash
npm run prisma:seed
```

Ou, se estiver usando o Prisma CLI diretamente:

```bash
npx prisma db seed
```

## Dados que serão criados

O script de seed criará os seguintes dados:

### Clientes
1. **João Silva**
   - Email: joao@email.com
   - Telefone: (11) 99999-1111
   - Senha: senha123
   - Pets: Rex (Cachorro), Nina (Gato)

2. **Maria Souza**
   - Email: maria@email.com
   - Telefone: (11) 99999-2222
   - Senha: senha123
   - Pets: Thor (Cachorro)

3. **Pedro Oliveira**
   - Email: pedro@email.com
   - Telefone: (11) 99999-3333
   - Senha: senha123
   - Pets: Mel (Cachorro)

### Pets
1. **Rex**
   - Espécie: Cachorro
   - Raça: Labrador
   - Idade: 3 anos
   - Peso: 15 kg
   - Dono: João Silva

2. **Nina**
   - Espécie: Gato
   - Raça: Siamês
   - Idade: 2 anos
   - Peso: 4 kg
   - Dono: João Silva

3. **Thor**
   - Espécie: Cachorro
   - Raça: Golden Retriever
   - Idade: 5 anos
   - Peso: 25 kg
   - Dono: Maria Souza

4. **Mel**
   - Espécie: Cachorro
   - Raça: Poodle
   - Idade: 4 anos
   - Peso: 8 kg
   - Dono: Pedro Oliveira

### Serviços
1. **Banho**
   - Preço: R$ 50,00
   - Descrição: Banho completo com shampoo especial

2. **Tosa**
   - Preço: R$ 70,00
   - Descrição: Tosa higiênica e estética

3. **Banho e Tosa**
   - Preço: R$ 100,00
   - Descrição: Pacote completo de banho e tosa

4. **Hidratação**
   - Preço: R$ 40,00
   - Descrição: Tratamento de hidratação para pelos

### Agendamentos
1. **Agendamento para Rex**
   - Status: AGENDADO
   - Data: Amanhã
   - Serviços: Banho, Tosa

2. **Agendamento para Thor**
   - Status: AGENDADO
   - Data: Daqui a 2 dias
   - Serviços: Banho e Tosa

3. **Agendamento para Nina**
   - Status: AGENDADO
   - Data: Daqui a 4 dias
   - Serviços: Banho

4. **Agendamento para Mel**
   - Status: CONCLUIDO
   - Data: 5 dias atrás
   - Serviços: Banho e Tosa, Hidratação

## Observações

- O script de seed limpa todos os dados existentes antes de inserir os novos dados.
- Os IDs são gerados automaticamente pelo banco de dados.
- Após executar o seed, você pode testar a API usando esses dados através da documentação Swagger disponível em `/api-docs`. 