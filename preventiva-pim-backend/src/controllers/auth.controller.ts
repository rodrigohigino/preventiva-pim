import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
