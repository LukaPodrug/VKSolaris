import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { issueWallet, getWallet, generateApplePass, generateGoogleWalletLink, walletHealth } from '../controllers/walletController.js';

const router = Router();

router.post('/issue/:userId', authMiddleware, issueWallet);
router.get('/card/:userId', authMiddleware, getWallet);
router.get('/apple/pass', generateApplePass);
router.get('/google/save-link', generateGoogleWalletLink);
router.get('/health', walletHealth);

export default router;


