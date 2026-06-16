import { Request, Response } from "express";
import User from "../models/User.js";
import SavedListing from "../models/SavedListing.js";
import Booking from "../models/Booking.js";

export const saveListing = async (req: Request, res: Response) => {
  try {
    const { listing } = req.body;

    const existing = await SavedListing.findOne({ student: req.user?.id, listing });

    if (existing) {
      return res.status(200).json({ message: "Already saved", saved: existing });
    }

    const saved = await SavedListing.create({ student: req.user?.id, listing });

    return res.status(201).json(saved);
  } catch (error: any) {
    // Handle duplicate key errors that may occur due to race conditions
    if (error && (error as any).code === 11000) {
      try {
        const existingSaved = await SavedListing.findOne({ student: req.user?.id, listing: req.body.listing });
        if (existingSaved) {
          return res.status(200).json({ message: 'Already saved', saved: existingSaved });
        }
      } catch (err) {
        // fallthrough to generic error
      }
    }

    return res.status(500).json({ message: error.message });
  }
};

export const getSavedListings = async (req: Request, res: Response) => {
  try {
    const savedListings = await SavedListing.find({ student: req.user?.id }).populate('listing');
    return res.json(savedListings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeSavedListing = async (req: Request, res: Response) => {
  try {
    const savedListing = await SavedListing.findById(req.params.id);

    if (!savedListing) {
      return res.status(404).json({ message: 'Saved listing not found' });
    }

    if (savedListing.student.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const unpaidBooking = await Booking.findOne({
      student: req.user?.id,
      listing: savedListing.listing,
      paymentStatus: { $in: ['unpaid', 'processing'] },
    });

    if (unpaidBooking) {
      return res.status(400).json({
        message: 'Cannot remove: you have an unpaid booking for this boarding. Please settle the payment first.',
      });
    }

    await savedListing.deleteOne();

    return res.json({ message: 'Saved listing removed' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = (await User.findById(userId).populate('currentBoarding')) as any;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.currentBoarding || null);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: 'listingId is required' });
    }

    const user = (await User.findByIdAndUpdate(
      userId,
      { currentBoarding: listingId },
      { new: true }
    ).populate('currentBoarding')) as any;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Current boarding updated successfully', currentBoarding: user.currentBoarding });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

