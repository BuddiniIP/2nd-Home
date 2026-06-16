import { RequestHandler } from "express";
import Notification from "../models/Notification.js";

export const getMyNotifications: RequestHandler = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: req.user!.id,
      isRead: false,
    });

    res.json({ data: notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

export const markAsRead: RequestHandler = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    if (notification.recipient.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead: RequestHandler = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

export const deleteNotification: RequestHandler = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    if (notification.recipient.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    await notification.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
