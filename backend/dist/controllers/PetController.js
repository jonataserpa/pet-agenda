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
exports.PetController = void 0;
const PetService_1 = require("../services/PetService");
class PetController {
    constructor() {
        this.service = new PetService_1.PetService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pets = yield this.service.findAll();
                return res.json(pets);
            }
            catch (error) {
                console.error('Erro ao buscar pets:', error);
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
                const pet = yield this.service.findById(id);
                if (!pet) {
                    return res.status(404).json({ error: 'Pet não encontrado' });
                }
                return res.json(pet);
            }
            catch (error) {
                console.error('Erro ao buscar pet por ID:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findByClienteId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clienteId = parseInt(req.params.clienteId);
                if (isNaN(clienteId)) {
                    return res.status(400).json({ error: 'ID do cliente inválido' });
                }
                const pets = yield this.service.findByClienteId(clienteId);
                return res.json(pets);
            }
            catch (error) {
                if (error.message.includes('Cliente não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar pets por cliente:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pet = req.body;
                if (!pet.nome || !pet.especie || !pet.raca || !pet.clienteId) {
                    return res.status(400).json({ error: 'Nome, espécie, raça e ID do cliente são campos obrigatórios' });
                }
                const novoPet = yield this.service.create(pet);
                return res.status(201).json(novoPet);
            }
            catch (error) {
                if (error.message.includes('Cliente não encontrado') ||
                    error.message.includes('campos obrigatórios') ||
                    error.message.includes('não pode ser negativa') ||
                    error.message.includes('deve ser maior que zero')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao criar pet:', error);
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
                const pet = req.body;
                if (!pet.nome || !pet.especie || !pet.raca || !pet.clienteId) {
                    return res.status(400).json({ error: 'Nome, espécie, raça e ID do cliente são campos obrigatórios' });
                }
                const petAtualizado = yield this.service.update(id, pet);
                return res.json(petAtualizado);
            }
            catch (error) {
                if (error.message.includes('Pet não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('Cliente não encontrado') ||
                    error.message.includes('campos obrigatórios') ||
                    error.message.includes('não pode ser negativa') ||
                    error.message.includes('deve ser maior que zero')) {
                    return res.status(400).json({ error: error.message });
                }
                console.error('Erro ao atualizar pet:', error);
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
                if (error.message.includes('Pet não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao excluir pet:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findWithCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const pet = yield this.service.findWithCliente(id);
                return res.json(pet);
            }
            catch (error) {
                if (error.message.includes('Pet não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar pet com cliente:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
    findWithAgendamentos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const pet = yield this.service.findWithAgendamentos(id);
                return res.json(pet);
            }
            catch (error) {
                if (error.message.includes('Pet não encontrado')) {
                    return res.status(404).json({ error: error.message });
                }
                console.error('Erro ao buscar pet com agendamentos:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.PetController = PetController;
