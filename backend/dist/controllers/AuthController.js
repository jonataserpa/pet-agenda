"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ClienteRepository_1 = require("../repositories/ClienteRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    constructor() {
        this.clienteRepository = new ClienteRepository_1.ClienteRepository();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, senha } = req.body;
                if (!email || !senha) {
                    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
                }
                const cliente = yield this.clienteRepository.findByEmail(email);
                if (!cliente) {
                    return res.status(401).json({ error: 'Credenciais inválidas' });
                }
                // Verificar senha usando bcrypt
                const senhaCorreta = yield bcrypt_1.default.compare(senha, cliente.senha);
                if (!senhaCorreta) {
                    return res.status(401).json({ error: 'Credenciais inválidas' });
                }
                // Gerando token JWT
                const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
                const token = jsonwebtoken_1.default.sign({ id: cliente.id, email: cliente.email }, jwtSecret, { expiresIn: '8h' });
                return res.json({
                    cliente: {
                        id: cliente.id,
                        nome: cliente.nome,
                        email: cliente.email
                    },
                    token
                });
            }
            catch (error) {
                console.error('Erro no login:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.AuthController = AuthController;
