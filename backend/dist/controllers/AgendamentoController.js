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
exports.AgendamentoController = void 0;
const AgendamentoService_1 = require("../services/AgendamentoService");
class AgendamentoController {
    constructor() {
        this.service = new AgendamentoService_1.AgendamentoService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamentos = yield this.service.findAll();
                return res.json(agendamentos);
            }
            catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
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
                const agendamento = yield this.service.findById(id);
                if (!agendamento) {
                    return res.status(404).json({ error: 'Agendamento não encontrado' });
                }
                return res.json(agendamento);
            }
            catch (error) {
                console.error('Erro ao buscar agendamento por ID:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findByPetId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const petId = parseInt(req.params.petId);
                if (isNaN(petId)) {
                    return res.status(400).json({ error: 'ID do pet inválido' });
                }
                const agendamentos = yield this.service.findByPetId(petId);
                return res.json(agendamentos);
            }
            catch (error) {
                if (error.message.includes('Pet não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar agendamentos por pet:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamento = req.body;
                if (!agendamento.data || !agendamento.status || !agendamento.petId) {
                    return res.status(400).json({ error: 'Data, status e ID do pet são campos obrigatórios' });
                }
                const novoAgendamento = yield this.service.create(agendamento);
                return res.status(201).json(novoAgendamento);
            }
            catch (error) {
                if (error.message.includes('Pet não encontrado') ||
                    error.message.includes('campos obrigatórios') ||
                    error.message.includes('Status inválido') ||
                    error.message.includes('Já existe um agendamento')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao criar agendamento:', error);
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
                const agendamento = req.body;
                if (!agendamento.data || !agendamento.status || !agendamento.petId) {
                    return res.status(400).json({ error: 'Data, status e ID do pet são campos obrigatórios' });
                }
                const agendamentoAtualizado = yield this.service.update(id, agendamento);
                return res.json(agendamentoAtualizado);
            }
            catch (error) {
                if (error.message.includes('Agendamento não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('Pet não encontrado') ||
                    error.message.includes('campos obrigatórios') ||
                    error.message.includes('Status inválido') ||
                    error.message.includes('Já existe um agendamento')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao atualizar agendamento:', error);
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
                if (error.message.includes('Agendamento não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao excluir agendamento:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findWithPet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const agendamento = yield this.service.findWithPet(id);
                return res.json(agendamento);
            }
            catch (error) {
                if (error.message.includes('Agendamento não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar agendamento com pet:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findWithServicos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const agendamento = yield this.service.findWithServicos(id);
                return res.json(agendamento);
            }
            catch (error) {
                if (error.message.includes('Agendamento não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar agendamento com serviços:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    addServico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamentoId = parseInt(req.params.id);
                const { servicoId } = req.body;
                if (isNaN(agendamentoId) || isNaN(servicoId)) {
                    return res.status(400).json({ error: 'IDs inválidos' });
                }
                yield this.service.addServico(agendamentoId, servicoId);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes('Agendamento não encontrado') ||
                    error.message.includes('Serviço não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao adicionar serviço ao agendamento:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    removeServico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const agendamentoId = parseInt(req.params.id);
                const servicoId = parseInt(req.params.servicoId);
                if (isNaN(agendamentoId) || isNaN(servicoId)) {
                    return res.status(400).json({ error: 'IDs inválidos' });
                }
                yield this.service.removeServico(agendamentoId, servicoId);
                return res.status(204).send();
            }
            catch (error) {
                if (error.message.includes('Agendamento não encontrado') ||
                    error.message.includes('Serviço não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao remover serviço do agendamento:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.AgendamentoController = AgendamentoController;
