import { Router } from 'express';
import { ExecucaoController } from '../controllers/execucao.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createExecucaoSchema } from '../validates/execucao.validate.js';

const router = Router();

// POST /execucoes  — registra a execução e recalcula proxima_em do plano
router.post('/', validate(createExecucaoSchema), ExecucaoController.registrar);

// GET /execucoes/plano/:planoId  — lista execuções de um plano
router.get('/plano/:planoId', ExecucaoController.listarPorPlano);

export default router;
