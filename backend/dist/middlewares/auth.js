"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token com formato inválido' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token com formato inválido' });
    }
    try {
        const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Adiciona o ID e email do usuário na requisição para uso posterior
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
