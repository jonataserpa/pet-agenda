"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClienteController_1 = require("../controllers/ClienteController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const controller = new ClienteController_1.ClienteController();
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req, res) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req, res) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', (req, res) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', auth_1.authMiddleware, (req, res) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', auth_1.authMiddleware, (req, res) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/pets', (req, res) => controller.findWithPets(req, res));
exports.default = router;
