import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';

import authRoutes from './auth.routes.js';
import equipamentoRoutes from './equipamento.routes.js';
import planoRoutes from './plano.routes.js';
import execucaoRoutes from './execucao.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// ── Rotas públicas ────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Rotas protegidas (JWT obrigatório) ────────────────────────
router.use(authMiddleware);

router.use('/equipamentos', equipamentoRoutes);
router.use('/planos', planoRoutes);
router.use('/execucoes', execucaoRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
