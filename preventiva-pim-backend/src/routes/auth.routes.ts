import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../validates/auth.validate.js';

const router = Router();

// POST /auth/login  — rota pública (sem authMiddleware)
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
