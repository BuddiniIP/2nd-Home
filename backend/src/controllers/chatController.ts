import { RequestHandler } from 'express';
import Conversation from '../models/Conversation.js';
import ChatMessage from '../models/ChatMessage.js';
import Notification from '../models/Notification.js';

export const getConversations: RequestHandler = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user!.id })
      .populate('participants', 'firstName lastName email profilePicture')
      .populate('listing', 'title images')
      .populate('lastSender', 'firstName lastName')
      .sort({ updatedAt: -1 })
      .lean();
    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

export const createConversation: RequestHandler = async (req, res, next) => {
  try {
    const { participantId, listingId } = req.body;
    if (!participantId) {
      res.status(400).json({ message: 'participantId is required' });
      return;
    }
    const existing = await Conversation.findOne({
      participants: { $all: [req.user!.id, participantId], $size: 2 },
    }).lean();
    if (existing) {
      res.json(existing);
      return;
    }
    const conversation = await Conversation.create({
      participants: [req.user!.id, participantId] as any,
      listing: listingId || undefined,
    });
    const populated = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName email profilePicture')
      .populate('listing', 'title images')
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getMessages: RequestHandler = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user!.id,
    }).lean();
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }
    const messages = await ChatMessage.find({ conversation: req.params.id })
      .populate('sender', 'firstName lastName profilePicture')
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Message content is required' });
      return;
    }
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user!.id,
    });
    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }
    const message = await ChatMessage.create({
      conversation: req.params.id,
      sender: req.user!.id as any,
      content: content.trim(),
      readBy: [req.user!.id] as any,
    });
    conversation.lastMessage = content.trim();
    (conversation as any).lastSender = req.user!.id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const recipient = conversation.participants.find((p: any) => p.toString() !== req.user!.id);
    if (recipient) {
      await Notification.create({
        recipient: recipient._id || recipient,
        type: 'message',
        title: 'New Message',
        message: content.trim().substring(0, 100),
        link: '/chat',
        relatedId: conversation._id,
      });
    }

    const populated = await ChatMessage.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture')
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const markMessageRead: RequestHandler = async (req, res, next) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    if (!message.readBy.some((r: any) => r.toString() === req.user!.id)) {
      (message.readBy as any).push(req.user!.id);
      await message.save();
    }
    res.json(message);
  } catch (err) {
    next(err);
  }
};
