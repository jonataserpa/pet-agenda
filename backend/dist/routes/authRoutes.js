"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
const controller = new AuthController_1.AuthController();
// @ts-ignore: Ignorar erro de tipo pois sabemos que esta é uma implementação válida
router.post('/login', (req, res) => controller.login(req, res));
exports.default = router;
