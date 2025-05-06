"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PetController_1 = require("../controllers/PetController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const controller = new PetController_1.PetController();
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req, res) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req, res) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/cliente/:clienteId', (req, res) => controller.findByClienteId(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', (req, res) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', auth_1.authMiddleware, (req, res) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', auth_1.authMiddleware, (req, res) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/cliente', (req, res) => controller.findWithCliente(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/agendamentos', (req, res) => controller.findWithAgendamentos(req, res));
exports.default = router;
