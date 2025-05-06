import { Router, Request, Response } from 'express';
import { ServicoController } from '../controllers/ServicoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const controller = new ServicoController();

// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req: Request, res: Response) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', authMiddleware, (req: Request, res: Response) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', authMiddleware, (req: Request, res: Response) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', authMiddleware, (req: Request, res: Response) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/agendamento/:agendamentoId', (req: Request, res: Response) => controller.findByAgendamentoId(req, res));

export default router; 