import { RequestHandler } from "express";
import User, { UserRole } from "../models/User.js";
import Notification from "../models/Notification.js";

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export const submitContact: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, message } = req.body as ContactBody;

    if (!name || !email || !message) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({ message: "Message too long (max 1000 characters)" });
      return;
    }

    const admins = await User.find({ role: UserRole.ADMIN }).select("_id").lean();
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      type: "contact" as const,
      title: "New Contact Message",
      message: `From ${name} (${email}): ${message.slice(0, 200)}`,
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};
