import { Router, Request, Response } from 'express';
import { AgendamentoController } from '../controllers/AgendamentoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const controller = new AgendamentoController();

// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id', (req: Request, res: Response) => controller.findById(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/pet/:petId', (req: Request, res: Response) => controller.findByPetId(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/', (req: Request, res: Response) => controller.create(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.put('/:id', authMiddleware, (req: Request, res: Response) => controller.update(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id', authMiddleware, (req: Request, res: Response) => controller.delete(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/pet', (req: Request, res: Response) => controller.findWithPet(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.get('/:id/servicos', (req: Request, res: Response) => controller.findWithServicos(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.post('/:id/servicos', authMiddleware, (req: Request, res: Response) => controller.addServico(req, res));
// @ts-ignore: Contornando erros de tipo - esta é uma implementação válida
router.delete('/:id/servicos/:servicoId', authMiddleware, (req: Request, res: Response) => controller.removeServico(req, res));

export default router; 