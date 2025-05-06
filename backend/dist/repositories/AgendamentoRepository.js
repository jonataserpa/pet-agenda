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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoRepository = void 0;
const client_1 = require("@prisma/client");
class AgendamentoRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.agendamento.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.agendamento.findUnique({
                where: { id },
            });
        });
    }
    findByPetId(petId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.agendamento.findMany({
                where: { petId },
            });
        });
    }
    create(agendamento) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pet, servicos } = agendamento, agendamentoData = __rest(agendamento, ["pet", "servicos"]);
            return this.prisma.agendamento.create({
                data: agendamentoData,
            });
        });
    }
    update(id, agendamento) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pet, servicos } = agendamento, agendamentoData = __rest(agendamento, ["pet", "servicos"]);
            return this.prisma.agendamento.update({
                where: { id },
                data: agendamentoData,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.agendamento.delete({
                where: { id },
            });
            return true;
        });
    }
    findWithPet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.agendamento.findUnique({
                where: { id },
                include: { pet: true },
            });
        });
    }
    findWithServicos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agendamento = yield this.prisma.agendamento.findUnique({
                where: { id },
            });
            if (!agendamento)
                return null;
            const agendamentoServicos = yield this.prisma.agendamentoServico.findMany({
                where: { agendamentoId: id },
                include: { servico: true },
            });
            const servicos = agendamentoServicos.map((as) => as.servico);
            return Object.assign(Object.assign({}, agendamento), { servicos });
        });
    }
    addServico(agendamentoId, servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.agendamentoServico.create({
                data: {
                    agendamentoId,
                    servicoId,
                },
            });
            return true;
        });
    }
    removeServico(agendamentoId, servicoId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.agendamentoServico.delete({
                where: {
                    agendamentoId_servicoId: {
                        agendamentoId,
                        servicoId,
                    },
                },
            });
            return true;
        });
    }
}
exports.AgendamentoRepository = AgendamentoRepository;
