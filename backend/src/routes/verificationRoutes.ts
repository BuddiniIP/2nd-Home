import express from "express";
import {
  requestVerification,
  cancelOwnerRequest,
  setOwnerAvailability,
  getMyOwnerRequests,
  assignVerifier,
  unassignVerifier,
  getPendingRequests,
  getMyAssignments,
  getAllAssignments,
  respondToAssignment,
  cancelAcceptedAssignment,
  uploadInspectionImage,
  submitInspection,
} from "../controllers/verificationController.js";
import { getInspectionUpload } from "../config/cloudinary.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

router.post("/request", protect, authorize(UserRole.OWNER), requestVerification);
router.post("/:id/cancel-request", protect, authorize(UserRole.OWNER), cancelOwnerRequest);
router.post("/:id/set-availability", protect, authorize(UserRole.OWNER), setOwnerAvailability);
router.get("/owner/my", protect, authorize(UserRole.OWNER), getMyOwnerRequests);

router.post("/assign", protect, authorize(UserRole.ADMIN), assignVerifier);
router.post("/admin/unassign/:id", protect, authorize(UserRole.ADMIN), unassignVerifier);
router.get("/pending-requests", protect, authorize(UserRole.ADMIN), getPendingRequests);
router.get("/all", protect, authorize(UserRole.ADMIN), getAllAssignments);

router.post("/upload", protect, authorize(UserRole.VERIFIER), getInspectionUpload().single('image'), uploadInspectionImage);

router.get("/my", protect, authorize(UserRole.VERIFIER), getMyAssignments);
router.post("/:id/respond", protect, authorize(UserRole.VERIFIER), respondToAssignment);
router.post("/:id/cancel-accepted", protect, authorize(UserRole.VERIFIER), cancelAcceptedAssignment);
router.patch("/:id/inspect", protect, authorize(UserRole.VERIFIER), submitInspection);

export default router;
