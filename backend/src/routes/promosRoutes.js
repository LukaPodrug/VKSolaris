import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { listPromos, createPromo, updatePromo, deletePromo } from '../controllers/promosController.js';

const router = Router();

router.get('/', authMiddleware, listPromos);
router.post('/', authMiddleware, createPromo);
router.patch('/:id', authMiddleware, updatePromo);
router.delete('/:id', authMiddleware, deletePromo);

export default router;


