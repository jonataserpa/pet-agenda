"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const clienteRoutes_1 = __importDefault(require("./clienteRoutes"));
const petRoutes_1 = __importDefault(require("./petRoutes"));
const servicoRoutes_1 = __importDefault(require("./servicoRoutes"));
const agendamentoRoutes_1 = __importDefault(require("./agendamentoRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/clientes', clienteRoutes_1.default);
router.use('/pets', petRoutes_1.default);
router.use('/servicos', servicoRoutes_1.default);
router.use('/agendamentos', agendamentoRoutes_1.default);
exports.default = router;
