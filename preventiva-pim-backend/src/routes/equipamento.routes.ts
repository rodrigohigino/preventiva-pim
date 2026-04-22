import { Router } from 'express';
import { EquipamentoController } from '../controllers/equipamento.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { requirePerfil } from '../middlewares/auth.middleware.js';
import {
  createEquipamentoSchema,
  updateEquipamentoSchema,
} from '../validates/equipamento.validate.js';

const router = Router();

router.get('/', EquipamentoController.listar);
router.get('/:id', EquipamentoController.buscarPorId);
router.post('/', validate(createEquipamentoSchema), EquipamentoController.criar);
router.put('/:id', validate(updateEquipamentoSchema), EquipamentoController.atualizar);
router.delete('/:id', requirePerfil('supervisor', 'gestor'), EquipamentoController.remover);

export default router;
