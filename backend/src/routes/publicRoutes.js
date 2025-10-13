import { Router } from 'express';
import { registerUser, getUserStatus } from '../controllers/publicController.js';

const router = Router();

router.post('/register', registerUser);
router.get('/status', getUserStatus);

export default router;


