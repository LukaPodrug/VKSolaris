import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { listUsers, createUser, approveUser, suspendUser } from '../controllers/usersController.js';
import { applyPromo } from '../controllers/userPromotionsController.js';

const router = Router();

router.get('/', authMiddleware, listUsers);
router.post('/', authMiddleware, createUser);
router.post('/:id/approve', authMiddleware, approveUser);
router.post('/:id/suspend', authMiddleware, suspendUser);
router.post('/:id/apply-promo', authMiddleware, applyPromo);

export default router;


