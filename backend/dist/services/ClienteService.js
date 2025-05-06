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
exports.ClienteService = void 0;
const ClienteRepository_1 = require("../repositories/ClienteRepository");
class ClienteService {
    constructor() {
        this.repository = new ClienteRepository_1.ClienteRepository();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findAll();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findById(id);
        });
    }
    create(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar se já existe um cliente com o mesmo e-mail
            const clienteExistente = yield this.repository.findByEmail(cliente.email);
            if (clienteExistente) {
                throw new Error('Já existe um cliente com este e-mail');
            }
            // Validar campos obrigatórios
            if (!cliente.nome || !cliente.email || !cliente.telefone) {
                throw new Error('Nome, e-mail e telefone são campos obrigatórios');
            }
            // Validar formato de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cliente.email)) {
                throw new Error('Formato de e-mail inválido');
            }
            return this.repository.create(cliente);
        });
    }
    update(id, cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o cliente existe
            const clienteExistente = yield this.repository.findById(id);
            if (!clienteExistente) {
                throw new Error('Cliente não encontrado');
            }
            // Verificar se o e-mail já existe (se estiver sendo alterado)
            if (cliente.email !== clienteExistente.email) {
                const clienteComMesmoEmail = yield this.repository.findByEmail(cliente.email);
                if (clienteComMesmoEmail) {
                    throw new Error('Já existe um cliente com este e-mail');
                }
            }
            // Validar campos obrigatórios
            if (!cliente.nome || !cliente.email || !cliente.telefone) {
                throw new Error('Nome, e-mail e telefone são campos obrigatórios');
            }
            // Validar formato de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cliente.email)) {
                throw new Error('Formato de e-mail inválido');
            }
            return this.repository.update(id, cliente);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o cliente existe
            const clienteExistente = yield this.repository.findById(id);
            if (!clienteExistente) {
                throw new Error('Cliente não encontrado');
            }
            return this.repository.delete(id);
        });
    }
    findWithPets(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = yield this.repository.findWithPets(id);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            return cliente;
        });
    }
}
exports.ClienteService = ClienteService;
