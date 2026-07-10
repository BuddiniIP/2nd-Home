import express from "express";
import {
  createMessage,
  getAllMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { UserRole } from "../models/User.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/admin/messages", protect, authorize(UserRole.ADMIN), getAllMessages);
router.patch("/admin/messages/:id/read", protect, authorize(UserRole.ADMIN), markMessageRead);
router.delete("/admin/messages/:id", protect, authorize(UserRole.ADMIN), deleteMessage);

export default router;
