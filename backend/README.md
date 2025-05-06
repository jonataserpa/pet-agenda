# Pet Agenda - Backend

API RESTful para sistema de agendamento de banho e tosa de pets, desenvolvido com Node.js, TypeScript, Express e Prisma ORM.

## Funcionalidades

- Autenticação JWT
- CRUD de Clientes
- CRUD de Pets
- CRUD de Serviços
- CRUD de Agendamentos
- Validações de regras de negócio
- Associação de serviços a agendamentos

## Pré-requisitos

- Node.js 14+ 
- Docker e Docker Compose (para o banco de dados)

## Instalação

1. Clone o repositório:
```
git clone <url-do-repositorio>
cd pet-agenda/backend
```

2. Instale as dependências:
```
npm install
```

3. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis de ambiente:
```
cp .env.example .env
```

4. Inicie o banco de dados com Docker Compose:
```
docker-compose up -d
```

5. Execute as migrações do Prisma para criar as tabelas no banco de dados:
```
npm run prisma:migrate
```

6. Gere o cliente Prisma:
```
npm run prisma:generate
```

7. (Opcional) Popule o banco de dados com dados de teste:
```
npm run prisma:seed
```

## Desenvolvimento

Para iniciar a aplicação em modo de desenvolvimento:

```
npm run dev
```

O servidor será iniciado na porta 3000 por padrão (ou na porta definida na variável de ambiente `PORT`).

A documentação Swagger da API estará disponível em:
```
http://localhost:3000/api-docs
```

## Testes

Para executar os testes unitários:

```
npm test
```

Para executar os testes com cobertura:

```
npm test -- --coverage
```

## Build

Para gerar a versão de produção:

```
npm run build
```

Os arquivos serão gerados no diretório `dist`.

## Produção

Para iniciar a aplicação em modo de produção:

```
npm start
```

## Estrutura do Projeto

```
src/
├── controllers/       # Controladores da API
├── models/           # Interfaces e tipos
├── repositories/     # Camada de acesso a dados
├── services/         # Lógica de negócios
├── middlewares/      # Middlewares Express
├── routes/           # Definição de rotas
├── tests/            # Testes unitários e de integração
│   ├── unit/         
│   └── integration/  
├── server.ts         # Ponto de entrada da aplicação
```

## API Endpoints

A documentação completa da API está disponível na interface do Swagger em `/api-docs` quando o servidor está em execução.

### Autenticação
- `POST /api/auth/login` - Login e geração de token JWT

### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Obter cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente
- `GET /api/clientes/:id/pets` - Listar pets de um cliente

### Pets
- `GET /api/pets` - Listar todos os pets
- `GET /api/pets/:id` - Obter pet por ID
- `GET /api/pets/cliente/:clienteId` - Listar pets de um cliente
- `POST /api/pets` - Criar novo pet
- `PUT /api/pets/:id` - Atualizar pet
- `DELETE /api/pets/:id` - Excluir pet
- `GET /api/pets/:id/cliente` - Obter pet com dados do cliente
- `GET /api/pets/:id/agendamentos` - Listar agendamentos de um pet

### Serviços
- `GET /api/servicos` - Listar todos os serviços
- `GET /api/servicos/:id` - Obter serviço por ID
- `POST /api/servicos` - Criar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Excluir serviço
- `GET /api/servicos/agendamento/:agendamentoId` - Listar serviços de um agendamento

### Agendamentos
- `GET /api/agendamentos` - Listar todos os agendamentos
- `GET /api/agendamentos/:id` - Obter agendamento por ID
- `GET /api/agendamentos/pet/:petId` - Listar agendamentos de um pet
- `POST /api/agendamentos` - Criar novo agendamento
- `PUT /api/agendamentos/:id` - Atualizar agendamento
- `DELETE /api/agendamentos/:id` - Excluir agendamento
- `GET /api/agendamentos/:id/pet` - Obter agendamento com dados do pet
- `GET /api/agendamentos/:id/servicos` - Listar serviços de um agendamento
- `POST /api/agendamentos/:id/servicos` - Adicionar serviço a um agendamento
- `DELETE /api/agendamentos/:id/servicos/:servicoId` - Remover serviço de um agendamento

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 