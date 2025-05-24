import { Router } from 'express';
import authRoutes from './authRoutes';
import clienteRoutes from './clienteRoutes';
import petRoutes from './petRoutes';
import servicoRoutes from './servicoRoutes';
import agendamentoRoutes from './agendamentoRoutes';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();
const dashboardController = new DashboardController();

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/pets', petRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);

// Add the dashboard route
router.get('/dashboard', (req, res) => dashboardController.getDashboardData(req, res));

export default router; 