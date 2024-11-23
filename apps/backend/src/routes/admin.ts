import { Router } from 'express';
import { adminLogin, checkAdmin } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', adminLogin);

router.get('/check-admin', authMiddleware, checkAdmin);

export const adminRouter = router;
