
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

    const listingDoc = await Listing.findById(listing);
    if (!listingDoc) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    const numAmount = Number(amount);
    if (numAmount < listingDoc.price) {
      res.status(400).json({ message: `Amount (${numAmount}) cannot be less than listing price (${listingDoc.price})` });
      return;
    }

    const startDate = rawStartDate ? new Date(rawStartDate) : new Date();
    const parsedEndDate = new Date(endDate);
    if (isNaN(startDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }
    if (parsedEndDate <= startDate) {
      res.status(400).json({ message: 'End date must be after start date' });
      return;
    }

    const booking = await Booking.create({
      student: req.user?.id,
      listing,
      startDate,
      endDate: parsedEndDate,
      amount: numAmount,
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