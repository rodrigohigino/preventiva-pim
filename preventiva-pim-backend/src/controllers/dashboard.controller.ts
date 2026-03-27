import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

const service = new DashboardService();

export const DashboardController = {
  async getDados(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getDados();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
