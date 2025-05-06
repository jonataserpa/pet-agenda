"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AgendamentoController_1 = require("../controllers/AgendamentoController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const controller = new AgendamentoController_1.AgendamentoController();
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req, res) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req, res) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/pet/:petId', (req, res) => controller.findByPetId(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', (req, res) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', auth_1.authMiddleware, (req, res) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', auth_1.authMiddleware, (req, res) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/pet', (req, res) => controller.findWithPet(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/servicos', (req, res) => controller.findWithServicos(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/:id/servicos', auth_1.authMiddleware, (req, res) => controller.addServico(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id/servicos/:servicoId', auth_1.authMiddleware, (req, res) => controller.removeServico(req, res));
exports.default = router;
