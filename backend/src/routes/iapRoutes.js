import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getOfferingForUser } from '../controllers/iapController.js';

const router = Router();

// Admin decides what offering to present for a user. Protected.
router.get('/offering', authMiddleware, getOfferingForUser);

export default router;


