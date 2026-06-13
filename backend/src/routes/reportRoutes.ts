import express from "express";
import {
  createReport,
  getAllReports,
  updateReport,
} from "../controllers/reportController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

/**
 * User route
 */
router.post(
  "/",
  protect,
  createReport
);

/**
 * Admin routes
 */
router.get(
  "/admin/reports",
  protect,
  authorize(UserRole.ADMIN),
  getAllReports
);

router.patch(
  "/admin/reports/:id",
  protect,
  authorize(UserRole.ADMIN),
  updateReport
);

export default router;