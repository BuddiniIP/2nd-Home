
import { Request, Response } from "express";
import Booking from "../models/Booking.js";

import Listing from '../models/Listing.js';

// Create booking (student)
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { listing, startDate: rawStartDate, endDate, amount } = req.body;
    if (!listing || !endDate || amount == null) {
      res.status(400).json({ message: 'listing, endDate, and amount are required' });
      return;
    }

    const listingDoc = await Listing.findById(listing).lean();
    if (!listingDoc) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    const startDate = rawStartDate ? new Date(rawStartDate) : new Date();
    const booking = await Booking.create({
      student: req.user?.id,
      listing,
      startDate,
      endDate: new Date(endDate),
      amount: Number(amount),
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
    const bookings = await Booking.find({ student: req.user?.id }).populate("listing").lean();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Owner bookings
export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const ownerListings = await Listing.find({ owner: req.user?.id }).select('_id').lean();
    const ownerListingIds = ownerListings.map(l => l._id);
    const bookings = await Booking.find({ listing: { $in: ownerListingIds } }).populate('listing').populate('student').lean();
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("listing")
      .populate("student")
      .lean();

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};