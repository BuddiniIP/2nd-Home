import express from "express";
import {
  saveListing,
  getSavedListings,
  removeSavedListing,
  getCurrentBoarding,// edited ss
  updateCurrentBoarding,// edited ss
} from "../controllers/studentController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

router.post(
  "/saved",
  protect,
  authorize(UserRole.STUDENT),
  saveListing
);

router.get(
  "/saved",
  protect,
  authorize(UserRole.STUDENT),
  getSavedListings
);

router.delete(
  "/saved/:id",
  protect,
  authorize(UserRole.STUDENT),
  removeSavedListing
);
// edited ss
router.get(
  "/current",
  protect,
  authorize(UserRole.STUDENT),
  getCurrentBoarding
);
// edited ss
router.put(
  "/current",
  protect,
  authorize(UserRole.STUDENT),
  updateCurrentBoarding
);

export default router;