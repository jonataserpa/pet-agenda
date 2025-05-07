"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger/swagger");
// Carrega as variáveis de ambiente
dotenv_1.default.config();
// Cria a aplicação Express
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Configuração dos middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Configura o Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Configura as rotas
app.use('/api', routes_1.default);
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
