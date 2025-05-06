import { Router } from 'express';
import authRoutes from './authRoutes';
import clienteRoutes from './clienteRoutes';
import petRoutes from './petRoutes';
import servicoRoutes from './servicoRoutes';
import agendamentoRoutes from './agendamentoRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/pets', petRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);

export default router; 