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
exports.PetService = void 0;
const PetRepository_1 = require("../repositories/PetRepository");
const ClienteRepository_1 = require("../repositories/ClienteRepository");
class PetService {
    constructor() {
        this.repository = new PetRepository_1.PetRepository();
        this.clienteRepository = new ClienteRepository_1.ClienteRepository();
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
    findByClienteId(clienteId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o cliente existe
            const cliente = yield this.clienteRepository.findById(clienteId);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            return this.repository.findByClienteId(clienteId);
        });
    }
    create(pet) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o cliente existe
            const cliente = yield this.clienteRepository.findById(pet.clienteId);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            // Validar campos obrigatórios
            if (!pet.nome || !pet.especie || !pet.raca) {
                throw new Error('Nome, espécie e raça são campos obrigatórios');
            }
            // Validar valores de idade e peso
            if (pet.idade < 0) {
                throw new Error('Idade não pode ser negativa');
            }
            if (pet.peso <= 0) {
                throw new Error('Peso deve ser maior que zero');
            }
            return this.repository.create(pet);
        });
    }
    update(id, pet) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o pet existe
            const petExistente = yield this.repository.findById(id);
            if (!petExistente) {
                throw new Error('Pet não encontrado');
            }
            // Se o clienteId estiver sendo alterado, verificar se o cliente existe
            if (pet.clienteId !== petExistente.clienteId) {
                const cliente = yield this.clienteRepository.findById(pet.clienteId);
                if (!cliente) {
                    throw new Error('Cliente não encontrado');
                }
            }
            // Validar campos obrigatórios
            if (!pet.nome || !pet.especie || !pet.raca) {
                throw new Error('Nome, espécie e raça são campos obrigatórios');
            }
            // Validar valores de idade e peso
            if (pet.idade < 0) {
                throw new Error('Idade não pode ser negativa');
            }
            if (pet.peso <= 0) {
                throw new Error('Peso deve ser maior que zero');
            }
            return this.repository.update(id, pet);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o pet existe
            const petExistente = yield this.repository.findById(id);
            if (!petExistente) {
                throw new Error('Pet não encontrado');
            }
            return this.repository.delete(id);
        });
    }
    findWithCliente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pet = yield this.repository.findWithCliente(id);
            if (!pet) {
                throw new Error('Pet não encontrado');
            }
            return pet;
        });
    }
    findWithAgendamentos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pet = yield this.repository.findWithAgendamentos(id);
            if (!pet) {
                throw new Error('Pet não encontrado');
            }
            return pet;
        });
    }
}
exports.PetService = PetService;
