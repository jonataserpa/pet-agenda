import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const controller = new AuthController();

// @ts-ignore: Ignorar erro de tipo pois sabemos que esta é uma implementação válida
router.post('/login', (req: Request, res: Response) => controller.login(req, res));
router.post('/logout', (req: Request, res: Response) => controller.logout(req, res));
router.get('/me', authMiddleware, (req: Request, res: Response) => controller.me(req, res));

export default router; 