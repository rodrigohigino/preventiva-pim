import { Router } from 'express';
import { PlanoController } from '../controllers/plano.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { requirePerfil } from '../middlewares/auth.middleware.js';
import { createPlanoSchema, updatePlanoSchema } from '../validates/plano.validate.js';

const router = Router();

// GET /planos?filtro=atrasadas|esta_semana|este_mes|todas
router.get('/', PlanoController.listar);
router.get('/:id', PlanoController.buscarPorId);
router.get('/:id/historico', PlanoController.historico);
router.post('/', validate(createPlanoSchema), PlanoController.criar);
router.put('/:id', validate(updatePlanoSchema), PlanoController.atualizar);
router.delete('/:id', requirePerfil('supervisor', 'gestor'), PlanoController.remover);

export default router;
