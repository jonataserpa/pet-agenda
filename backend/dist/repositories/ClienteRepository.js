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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepository = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ClienteRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.cliente.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.cliente.findUnique({
                where: { id },
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.cliente.findUnique({
                where: { email },
            });
        });
    }
    create(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pets } = cliente, clienteData = __rest(cliente, ["pets"]);
            // Criptografar a senha
            const hashedSenha = yield bcrypt_1.default.hash(clienteData.senha, 10);
            return this.prisma.cliente.create({
                data: Object.assign(Object.assign({}, clienteData), { senha: hashedSenha }),
            });
        });
    }
    update(id, cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pets } = cliente, clienteData = __rest(cliente, ["pets"]);
            // Se a senha for fornecida, criptografá-la
            let dadosAtualizados = Object.assign({}, clienteData);
            if (clienteData.senha) {
                const hashedSenha = yield bcrypt_1.default.hash(clienteData.senha, 10);
                dadosAtualizados = Object.assign(Object.assign({}, dadosAtualizados), { senha: hashedSenha });
            }
            return this.prisma.cliente.update({
                where: { id },
                data: dadosAtualizados,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.cliente.delete({
                where: { id },
            });
            return true;
        });
    }
    findWithPets(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.cliente.findUnique({
                where: { id },
                include: { pets: true },
            });
        });
    }
}
exports.ClienteRepository = ClienteRepository;
