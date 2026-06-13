

import express from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
} from "../controllers/bookingController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

// Student
router.post(
  "/",
  protect,
  authorize(UserRole.STUDENT),
  createBooking
);

router.get(
  "/",
  protect,
  authorize(UserRole.STUDENT),
  getMyBookings
);

// Owner
router.get(
  "/owner/bookings",
  protect,
  authorize(UserRole.OWNER),
  getOwnerBookings
);

// Admin
router.get(
  "/admin/bookings",
  protect,
  authorize(UserRole.ADMIN),
  getAllBookings
);

export default router;