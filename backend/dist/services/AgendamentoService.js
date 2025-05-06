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
exports.AgendamentoService = void 0;
const AgendamentoRepository_1 = require("../repositories/AgendamentoRepository");
const PetRepository_1 = require("../repositories/PetRepository");
const ServicoRepository_1 = require("../repositories/ServicoRepository");
class AgendamentoService {
    constructor() {
        this.repository = new AgendamentoRepository_1.AgendamentoRepository();
        this.petRepository = new PetRepository_1.PetRepository();
        this.servicoRepository = new ServicoRepository_1.ServicoRepository();
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
    findByPetId(petId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o pet existe
            const pet = yield this.petRepository.findById(petId);
            if (!pet) {
                throw new Error('Pet não encontrado');
            }
            return this.repository.findByPetId(petId);
        });
    }
    create(agendamento) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar se o pet existe
            const pet = yield this.petRepository.findById(agendamento.petId);
            if (!pet) {
                throw new Error('Pet não encontrado');
            }
            // Validar campos obrigatórios
            if (!agendamento.data || !agendamento.status) {
                throw new Error('Data e status são campos obrigatórios');
            }
            // Validar status válido
            const statusValidos = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
            if (!statusValidos.includes(agendamento.status.toUpperCase())) {
                throw new Error('Status inválido. Valores válidos: AGENDADO, CONCLUIDO, CANCELADO');
            }
            // Verificar se já existe um agendamento na mesma data
            const agendamentosNaData = yield this.repository.findAll();
            const dataAgendamento = new Date(agendamento.data);
            const conflito = agendamentosNaData.some(ag => {
                const dataExistente = new Date(ag.data);
                return (dataExistente.getFullYear() === dataAgendamento.getFullYear() &&
                    dataExistente.getMonth() === dataAgendamento.getMonth() &&
                    dataExistente.getDate() === dataAgendamento.getDate() &&
                    dataExistente.getHours() === dataAgendamento.getHours());
            });
            if (conflito) {
                throw new Error('Já existe um agendamento nesta data e horário');
            }
            // Padronizar o status para maiúsculas
            agendamento.status = agendamento.status.toUpperCase();
            return this.repository.create(agendamento);
        });
    }
    update(id, agendamento) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o agendamento existe
            const agendamentoExistente = yield this.repository.findById(id);
            if (!agendamentoExistente) {
                throw new Error('Agendamento não encontrado');
            }
            // Se estiver alterando o pet, verificar se o novo pet existe
            if (agendamento.petId !== agendamentoExistente.petId) {
                const pet = yield this.petRepository.findById(agendamento.petId);
                if (!pet) {
                    throw new Error('Pet não encontrado');
                }
            }
            // Validar campos obrigatórios
            if (!agendamento.data || !agendamento.status) {
                throw new Error('Data e status são campos obrigatórios');
            }
            // Validar status válido
            const statusValidos = ['AGENDADO', 'CONCLUIDO', 'CANCELADO'];
            if (!statusValidos.includes(agendamento.status.toUpperCase())) {
                throw new Error('Status inválido. Valores válidos: AGENDADO, CONCLUIDO, CANCELADO');
            }
            // Se estiver alterando a data, verificar conflitos
            if (agendamento.data.toString() !== agendamentoExistente.data.toString()) {
                const agendamentosNaData = yield this.repository.findAll();
                const dataAgendamento = new Date(agendamento.data);
                const conflito = agendamentosNaData.some(ag => {
                    if (ag.id === id)
                        return false; // Ignorar o próprio agendamento
                    const dataExistente = new Date(ag.data);
                    return (dataExistente.getFullYear() === dataAgendamento.getFullYear() &&
                        dataExistente.getMonth() === dataAgendamento.getMonth() &&
                        dataExistente.getDate() === dataAgendamento.getDate() &&
                        dataExistente.getHours() === dataAgendamento.getHours());
                });
                if (conflito) {
                    throw new Error('Já existe um agendamento nesta data e horário');
                }
            }
            // Padronizar o status para maiúsculas
            agendamento.status = agendamento.status.toUpperCase();
            return this.repository.update(id, agendamento);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o agendamento existe
            const agendamentoExistente = yield this.repository.findById(id);
            if (!agendamentoExistente) {
                throw new Error('Agendamento não encontrado');
            }
            return this.repository.delete(id);
        });
    }
    findWithPet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agendamento = yield this.repository.findWithPet(id);
            if (!agendamento) {
                throw new Error('Agendamento não encontrado');
            }
            return agendamento;
        });
    }
    findWithServicos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agendamento = yield this.repository.findWithServicos(id);
            if (!agendamento) {
                throw new Error('Agendamento não encontrado');
            }
            return agendamento;
        });
    }
    addServico(agendamentoId, servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o agendamento existe
            const agendamento = yield this.repository.findById(agendamentoId);
            if (!agendamento) {
                throw new Error('Agendamento não encontrado');
            }
            // Verificar se o serviço existe
            const servico = yield this.servicoRepository.findById(servicoId);
            if (!servico) {
                throw new Error('Serviço não encontrado');
            }
            return this.repository.addServico(agendamentoId, servicoId);
        });
    }
    removeServico(agendamentoId, servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o agendamento existe
            const agendamento = yield this.repository.findById(agendamentoId);
            if (!agendamento) {
                throw new Error('Agendamento não encontrado');
            }
            // Verificar se o serviço existe
            const servico = yield this.servicoRepository.findById(servicoId);
            if (!servico) {
                throw new Error('Serviço não encontrado');
            }
            return this.repository.removeServico(agendamentoId, servicoId);
        });
    }
}
exports.AgendamentoService = AgendamentoService;
