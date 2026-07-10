import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import {
  createCheckoutSession,
  verifySession,
  getDashboardStats,
  getOwnerStats,
  getMyPayments,
  getOwnerPayments,
  confirmPayment,
  checkoutStudent,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protect, authorize(UserRole.STUDENT), createCheckoutSession);
router.post('/verify-session', protect, authorize(UserRole.STUDENT), verifySession);
router.get('/stats', protect, authorize(UserRole.STUDENT), getDashboardStats);
router.get('/owner/stats', protect, authorize(UserRole.OWNER), getOwnerStats);
router.get('/my', protect, authorize(UserRole.STUDENT), getMyPayments);
router.get('/owner', protect, authorize(UserRole.OWNER), getOwnerPayments);
router.patch('/:bookingId/confirm', protect, authorize(UserRole.OWNER), confirmPayment);
router.post('/:bookingId/checkout', protect, authorize(UserRole.STUDENT), checkoutStudent);

export default router;
