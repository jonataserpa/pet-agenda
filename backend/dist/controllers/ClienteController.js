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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
const ClienteService_1 = require("../services/ClienteService");
class ClienteController {
    constructor() {
        this.service = new ClienteService_1.ClienteService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientes = yield this.service.findAll();
                return res.json(clientes);
            }
            catch (error) {
                console.error('Erro ao buscar clientes:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const cliente = yield this.service.findById(id);
                if (!cliente) {
                    return res.status(404).json({ error: 'Cliente não encontrado' });
                }
                return res.json(cliente);
            }
            catch (error) {
                console.error('Erro ao buscar cliente por ID:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cliente = req.body;
                if (!cliente.nome || !cliente.email || !cliente.telefone) {
                    return res.status(400).json({ error: 'Nome, e-mail e telefone são campos obrigatórios' });
                }
                const novoCliente = yield this.service.create(cliente);
                return res.status(201).json(novoCliente);
            }
            catch (error) {
                if (error.message.includes('já existe um cliente com este e-mail') ||
                    error.message.includes('obrigatórios') ||
                    error.message.includes('formato de e-mail')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao criar cliente:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const cliente = req.body;
                if (!cliente.nome || !cliente.email || !cliente.telefone) {
                    return res.status(400).json({ error: 'Nome, e-mail e telefone são campos obrigatórios' });
                }
                const clienteAtualizado = yield this.service.update(id, cliente);
                return res.json(clienteAtualizado);
            }
            catch (error) {
                if (error.message.includes('Cliente não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('já existe um cliente com este e-mail') ||
                    error.message.includes('obrigatórios') ||
                    error.message.includes('formato de e-mail')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao atualizar cliente:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                yield this.service.delete(id);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes('Cliente não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao excluir cliente:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findWithPets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const cliente = yield this.service.findWithPets(id);
                return res.json(cliente);
            }
            catch (error) {
                if (error.message.includes('Cliente não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar cliente com pets:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.ClienteController = ClienteController;
