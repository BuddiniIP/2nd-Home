import { RequestHandler } from "express";
import Message from "../models/Message.js";

export const createMessage: RequestHandler = async (req, res, next) => {
  try {
    const { email, subject, message, type } = req.body;
    if (!email || !subject || !message) {
      res.status(400).json({ message: "Email, subject, and message are required" });
      return;
    }
    const msg = await Message.create({
      sender: (req as any).user?.id || null,
      email,
      subject,
      message,
      type: type || "general",
    });
    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

export const getAllMessages: RequestHandler = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate("sender", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const markMessageRead: RequestHandler = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { returnDocument: 'after' }
    );
    if (!msg) {
      res.status(404).json({ message: "Message not found" });
      return;
    }
    res.json(msg);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) {
      res.status(404).json({ message: "Message not found" });
      return;
    }
    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};
