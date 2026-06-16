import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';
import {
  createCheckoutSession,
  verifySession,
  getMyPayments,
  getOwnerPayments,
  confirmPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', protect, authorize(UserRole.STUDENT), createCheckoutSession);
router.post('/verify-session', protect, authorize(UserRole.STUDENT), verifySession);
router.get('/my', protect, authorize(UserRole.STUDENT), getMyPayments);
router.get('/owner', protect, authorize(UserRole.OWNER), getOwnerPayments);
router.patch('/:bookingId/confirm', protect, authorize(UserRole.OWNER), confirmPayment);

export default router;
