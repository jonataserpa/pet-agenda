import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger';
import cookieParser from 'cookie-parser';

// Carrega as variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();
const port = process.env.PORT || 3000;

// Configuração dos middlewares
app.use(cors({
  origin: 'http://localhost:3001', // ajuste para a porta do frontend
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Configura o Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configura as rotas
app.use('/api', routes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema de Agendamento de Banho e Tosa de Pets',
    version: '1.0.0',
    docs: `http://localhost:${port}/api-docs`
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
}); 