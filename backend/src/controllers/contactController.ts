import { RequestHandler } from "express";
import Notification from "../models/Notification.js";
import User, { UserRole } from "../models/User.js";

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

    // Notify admins
    const admins = await User.find({ role: UserRole.ADMIN }).select("_id").lean();
    const notifications = admins.map((admin: { _id: unknown }) => ({
      recipient: admin._id,
      type: "contact",
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
