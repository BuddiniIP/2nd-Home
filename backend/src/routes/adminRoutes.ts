import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import {
  getAdminBoardings,
  getAdminMessages,
  getAdminPayments,
  getAdminReports,
  getAdminStats,
  getAdminUsers,
  updatePaymentStatus,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize(UserRole.ADMIN));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/boardings', getAdminBoardings);
router.get('/payments', getAdminPayments);
router.get('/messages', getAdminMessages);
router.get('/reports', getAdminReports);
router.patch('/payments/:id/status', updatePaymentStatus);

export default router;