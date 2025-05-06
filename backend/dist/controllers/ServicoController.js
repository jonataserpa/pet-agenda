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
exports.ServicoController = void 0;
const ServicoService_1 = require("../services/ServicoService");
class ServicoController {
    constructor() {
        this.service = new ServicoService_1.ServicoService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicos = yield this.service.findAll();
                return res.json(servicos);
            }
            catch (error) {
                console.error('Erro ao buscar serviços:', error);
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
                const servico = yield this.service.findById(id);
                if (!servico) {
                    return res.status(404).json({ error: 'Serviço não encontrado' });
                }
                return res.json(servico);
            }
            catch (error) {
                console.error('Erro ao buscar serviço por ID:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servico = req.body;
                if (!servico.nome || !servico.descricao) {
                    return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios' });
                }
                if (servico.preco <= 0) {
                    return res.status(400).json({ error: 'Preço deve ser maior que zero' });
                }
                const novoServico = yield this.service.create(servico);
                return res.status(201).json(novoServico);
            }
            catch (error) {
                if (error.message.includes('campos obrigatórios') ||
                    error.message.includes('deve ser maior que zero')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao criar serviço:', error);
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
                const servico = req.body;
                if (!servico.nome || !servico.descricao) {
                    return res.status(400).json({ error: 'Nome e descrição são campos obrigatórios' });
                }
                if (servico.preco <= 0) {
                    return res.status(400).json({ error: 'Preço deve ser maior que zero' });
                }
                const servicoAtualizado = yield this.service.update(id, servico);
                return res.json(servicoAtualizado);
            }
            catch (error) {
                if (error.message.includes('Serviço não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('campos obrigatórios') ||
                    error.message.includes('deve ser maior que zero')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao atualizar serviço:', error);
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
                if (error.message.includes('Serviço não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao excluir serviço:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findByAgendamentoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamentoId = parseInt(req.params.agendamentoId);
                if (isNaN(agendamentoId)) {
                    return res.status(400).json({ error: 'ID do agendamento inválido' });
                }
                const servicos = yield this.service.findByAgendamentoId(agendamentoId);
                return res.json(servicos);
            }
            catch (error) {
                console.error('Erro ao buscar serviços por agendamento:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.ServicoController = ServicoController;
