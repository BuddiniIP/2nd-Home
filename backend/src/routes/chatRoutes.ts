import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessageRead,
} from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/messages/:id/read', markMessageRead);

export default router;
