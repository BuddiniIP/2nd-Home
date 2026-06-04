import express from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getAllBookings,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student
router.post("/", protect, createBooking);
router.get("/", protect, getMyBookings);

// Owner
router.get("/owner/bookings", protect, getOwnerBookings);

// Admin
router.get("/admin/bookings", protect, getAllBookings);

export default router;