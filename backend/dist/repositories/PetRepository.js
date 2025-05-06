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
exports.PetRepository = void 0;
const client_1 = require("@prisma/client");
class PetRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.pet.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.pet.findUnique({
                where: { id },
            });
        });
    }
    findByClienteId(clienteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.pet.findMany({
                where: { clienteId },
            });
        });
    }
    create(pet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cliente, agendamentos } = pet, petData = __rest(pet, ["cliente", "agendamentos"]);
            return this.prisma.pet.create({
                data: petData,
            });
        });
    }
    update(id, pet) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cliente, agendamentos } = pet, petData = __rest(pet, ["cliente", "agendamentos"]);
            return this.prisma.pet.update({
                where: { id },
                data: petData,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.pet.delete({
                where: { id },
            });
            return true;
        });
    }
    findWithCliente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.pet.findUnique({
                where: { id },
                include: { cliente: true },
            });
        });
    }
    findWithAgendamentos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.pet.findUnique({
                where: { id },
                include: { agendamentos: true },
            });
        });
    }
}
exports.PetRepository = PetRepository;
