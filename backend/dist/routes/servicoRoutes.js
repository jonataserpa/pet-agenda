"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServicoController_1 = require("../controllers/ServicoController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const controller = new ServicoController_1.ServicoController();
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req, res) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req, res) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', auth_1.authMiddleware, (req, res) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', auth_1.authMiddleware, (req, res) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', auth_1.authMiddleware, (req, res) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/agendamento/:agendamentoId', (req, res) => controller.findByAgendamentoId(req, res));
exports.default = router;
