import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Agenda API',
      version,
      description: 'API para sistema de agendamento de banho e tosa de pets',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Suporte Pet Agenda',
        email: 'suporte@petagenda.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API principal',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do cliente',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome do cliente',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              description: 'Email do cliente',
              example: 'joao@email.com',
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente',
              example: '(11) 99999-9999',
            },
            senha: {
              type: 'string',
              description: 'Senha do cliente (criptografada quando armazenada)',
              example: 'senha123',
            },
            status: {
              type: 'string',
              description: 'Status do cliente',
              enum: ['ATIVO', 'INATIVO'],
              example: 'ATIVO',
            },
            observacao: {
              type: 'string',
              description: 'Observações gerais sobre o cliente',
              example: 'Cliente prefere contato por WhatsApp',
            },
          },
          required: ['nome', 'email', 'telefone', 'senha'],
        },
        Pet: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do pet',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome do pet',
              example: 'Rex',
            },
            especie: {
              type: 'string',
              description: 'Espécie do pet',
              example: 'Cachorro',
            },
            raca: {
              type: 'string',
              description: 'Raça do pet',
              example: 'Labrador',
            },
            idade: {
              type: 'integer',
              description: 'Idade do pet em anos',
              example: 3,
            },
            peso: {
              type: 'integer',
              description: 'Peso do pet em kg',
              example: 15,
            },
            clienteId: {
              type: 'integer',
              description: 'ID do cliente proprietário',
              example: 1,
            },
          },
          required: ['nome', 'especie', 'raca', 'idade', 'peso', 'clienteId'],
        },
        Servico: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do serviço',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome do serviço',
              example: 'Banho',
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço do serviço',
              example: 50.0,
            },
            descricao: {
              type: 'string',
              description: 'Descrição do serviço',
              example: 'Banho completo com shampoo especial',
            },
          },
          required: ['nome', 'preco', 'descricao'],
        },
        Agendamento: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do agendamento',
              example: 1,
            },
            data: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do agendamento',
              example: '2023-01-01T10:00:00Z',
            },
            status: {
              type: 'string',
              enum: ['AGENDADO', 'CONCLUIDO', 'CANCELADO'],
              description: 'Status do agendamento',
              example: 'AGENDADO',
            },
            petId: {
              type: 'integer',
              description: 'ID do pet',
              example: 1,
            },
          },
          required: ['data', 'status', 'petId'],
        },
        Auth: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email do cliente',
              example: 'joao@email.com',
            },
            senha: {
              type: 'string',
              description: 'Senha do cliente (em texto puro para autenticação)',
              example: 'senha123',
            },
          },
          required: ['email', 'senha'],
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Erro interno do servidor',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/swagger/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options); 