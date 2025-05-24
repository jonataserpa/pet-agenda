import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }

  async getDashboardData(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this.service.getDashboardData();
      return res.json(data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 