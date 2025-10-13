import { Router } from 'express';
import { registerUser, getUserStatus, getActivePromo, createCheckoutSession, getPurchaseStatus, issueWalletByMember } from '../controllers/publicController.js';

const router = Router();

router.post('/register', registerUser);
router.get('/status', getUserStatus);
router.get('/active-promo', getActivePromo);
router.post('/checkout-session', createCheckoutSession);
router.get('/purchase-status', getPurchaseStatus);
router.post('/wallet/issue', issueWalletByMember);

export default router;


