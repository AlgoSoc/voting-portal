import { Router } from 'express';
import {
  addCandidate,
  addPosition,
  adminLogin,
  checkAdmin,
  deleteCandidate,
  getCandidates,
  getPositions,
} from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', adminLogin);

router.get('/check-admin', authMiddleware, checkAdmin);

router
  .get('/candidates', authMiddleware, getCandidates)
  .post('/candidates', authMiddleware, addCandidate);

router
  .get('/positions', authMiddleware, getPositions)
  .post('/positions', authMiddleware, addPosition);

router.delete('/candidates/:id', authMiddleware, deleteCandidate);

export const adminRouter = router;
