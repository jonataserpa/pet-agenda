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
exports.ServicoService = void 0;
const ServicoRepository_1 = require("../repositories/ServicoRepository");
class ServicoService {
    constructor() {
        this.repository = new ServicoRepository_1.ServicoRepository();
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
    create(servico) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar campos obrigatórios
            if (!servico.nome || !servico.descricao) {
                throw new Error('Nome e descrição são campos obrigatórios');
            }
            // Validar preço
            if (servico.preco <= 0) {
                throw new Error('Preço deve ser maior que zero');
            }
            return this.repository.create(servico);
        });
    }
    update(id, servico) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o serviço existe
            const servicoExistente = yield this.repository.findById(id);
            if (!servicoExistente) {
                throw new Error('Serviço não encontrado');
            }
            // Validar campos obrigatórios
            if (!servico.nome || !servico.descricao) {
                throw new Error('Nome e descrição são campos obrigatórios');
            }
            // Validar preço
            if (servico.preco <= 0) {
                throw new Error('Preço deve ser maior que zero');
            }
            return this.repository.update(id, servico);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o serviço existe
            const servicoExistente = yield this.repository.findById(id);
            if (!servicoExistente) {
                throw new Error('Serviço não encontrado');
            }
            return this.repository.delete(id);
        });
    }
    findByAgendamentoId(agendamentoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findByAgendamentoId(agendamentoId);
        });
    }
}
exports.ServicoService = ServicoService;
