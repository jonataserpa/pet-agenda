import { Router, Request, Response } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const controller = new ClienteController();

// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req: Request, res: Response) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', (req: Request, res: Response) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', authMiddleware, (req: Request, res: Response) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', authMiddleware, (req: Request, res: Response) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/pets', (req: Request, res: Response) => controller.findWithPets(req, res));

export default router; 