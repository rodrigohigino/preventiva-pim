import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';

const router = Router();

// GET /dashboard
router.get('/', DashboardController.getDados);

export default router;
