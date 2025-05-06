import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

// @ts-ignore: Ignorar erro de tipo pois sabemos que esta é uma implementação válida
router.post('/login', (req: Request, res: Response) => controller.login(req, res));

export default router; 