
import { Request, Response } from "express";
import Booking from "../models/Booking.js";

// Create booking (student)
export const createBooking = async (req: Request, res: Response) => {
  try {
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const booking = await Booking.create({
      student: req.user?.id,
      ...req.body,
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Student bookings
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ student: req.user?.id }).populate("listing");
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Owner bookings
export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("listing")
      .populate("student");

    const ownerBookings = bookings.filter(
      (b: any) => b.listing.owner.toString() === req.user?.id
    );

    res.json(ownerBookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("listing")
      .populate("student");

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};