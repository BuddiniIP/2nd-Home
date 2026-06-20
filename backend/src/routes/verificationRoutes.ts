import express from "express";
import {
  requestVerification,
  assignVerifier,
  getMyAssignments,
  getAllAssignments,
  submitInspection,
} from "../controllers/verificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

router.post("/request", protect, authorize(UserRole.OWNER), requestVerification);
router.post("/assign", protect, authorize(UserRole.ADMIN), assignVerifier);
router.get("/my", protect, authorize(UserRole.VERIFIER), getMyAssignments);
router.get("/all", protect, authorize(UserRole.ADMIN), getAllAssignments);
router.patch("/:id/inspect", protect, authorize(UserRole.VERIFIER), submitInspection);

export default router;
