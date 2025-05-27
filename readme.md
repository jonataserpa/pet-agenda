# Pet Agenda

## Visão Geral

Pet Agenda é uma aplicação abrangente projetada para gerenciar agendamentos de pets, serviços e informações de clientes. Consiste em um backend construído com Node.js e Express, e um frontend desenvolvido usando Next.js e React.

## Backend

### Tecnologias Utilizadas
- Node.js
- Express
- Prisma
- MySQL

### Como Executar o Backend
1. **Instalar Dependências**: Navegue até o diretório do backend e execute `npm install` para instalar todos os pacotes necessários.
2. **Configurar Banco de Dados**: Certifique-se de ter um banco de dados MySQL em execução. Atualize o `DATABASE_URL` no arquivo `.env` com a string de conexão do seu banco de dados.
3. **Executar Migrações**: Execute `npx prisma migrate dev` para aplicar as migrações do banco de dados.
4. **Iniciar o Servidor**: Execute `npm start` para iniciar o servidor backend.

### Endpoints da API
- **Autenticação**: `/auth`
- **Clientes**: `/clientes`
- **Pets**: `/pets`
- **Serviços**: `/servicos`
- **Agendamentos**: `/agendamentos`
- **Dashboard**: `/dashboard`

## Frontend

### Tecnologias Utilizadas
- Next.js
- React
- Tailwind CSS

### Como Executar o Frontend
1. **Instalar Dependências**: Navegue até o diretório do frontend e execute `npm install` para instalar todos os pacotes necessários.
2. **Configurar Variáveis de Ambiente**: Certifique-se de que o `NEXT_PUBLIC_API_URL` no arquivo `.env` aponte para o seu servidor backend.
3. **Iniciar o Servidor de Desenvolvimento**: Execute `npm run dev` para iniciar o servidor de desenvolvimento do frontend.

### Funcionalidades
- **Dashboard**: Visualizar estatísticas e atividades recentes.
- **Gerenciar Clientes**: Adicionar, editar e excluir informações de clientes.
- **Gerenciar Pets**: Adicionar, editar e excluir informações de pets.
- **Gerenciar Serviços**: Adicionar, editar e excluir serviços.
- **Gerenciar Agendamentos**: Agendar, editar e excluir agendamentos.

## Uso
- Acesse a aplicação via URL do frontend (por exemplo, `http://localhost:3000`).
- Use o dashboard para obter uma visão geral das atividades.
- Navegue pelo menu para gerenciar clientes, pets, serviços e agendamentos.

## Contribuição
Sinta-se à vontade para fazer um fork deste repositório e enviar pull requests. Para mudanças significativas, por favor, abra uma issue primeiro para discutir o que você gostaria de mudar.

## Licença
Este projeto está licenciado sob a Licença MIT.

## Executando com Docker Compose

### Pré-requisitos
- Docker
- Docker Compose

### Como Executar o Projeto com Docker Compose
1. **Construir e Iniciar os Contêineres**: Navegue até o diretório raiz do projeto e execute `docker-compose up --build` para construir e iniciar os contêineres.
2. **Acessar o Banco de Dados**: Certifique-se de que o contêiner do banco de dados está em execução e acessível.
3. **Executar o Script de Seed**: Após os contêineres estarem em execução, execute o script `seed.sql` para popular o banco de dados com dados iniciais. Você pode fazer isso acessando o contêiner do banco de dados e executando o comando apropriado para importar o arquivo SQL.

### Observações
- Certifique-se de que as portas necessárias estão disponíveis e não estão em uso por outros serviços.
- Verifique os logs dos contêineres para garantir que todos os serviços estão funcionando corretamente `docker logs <nome_do_container>`.
- Para parar os contêineres, execute `docker-compose down`. 