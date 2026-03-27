import { Request, Response, NextFunction } from 'express';
import { PlanoService, FiltroPrazo } from '../services/plano.service.js';

const service = new PlanoService();

export const PlanoController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const filtro = (req.query.filtro as FiltroPrazo) || 'todas';
      const data = await service.listar(filtro);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.buscarPorId(Number(req.params.id));
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async historico(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.historico(Number(req.params.id));
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.criar(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.atualizar(Number(req.params.id), req.body);
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
