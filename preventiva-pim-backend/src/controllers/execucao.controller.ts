import { Request, Response, NextFunction } from 'express';
import { ExecucaoService } from '../services/execucao.service.js';

const service = new ExecucaoService();

export const ExecucaoController = {
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.registrar(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  async listarPorPlano(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.listarPorPlano(Number(req.params.planoId));
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      await service.remover(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
