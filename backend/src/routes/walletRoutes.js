import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { issueWallet, getWallet } from '../controllers/walletController.js';

const router = Router();

router.post('/issue/:userId', authMiddleware, issueWallet);
router.get('/card/:userId', authMiddleware, getWallet);

export default router;


