import { Request, Response } from "express";
import User from "../models/User.js"; // edited ss

import SavedListing from "../models/SavedListing.js";

export const saveListing = async (req: Request, res: Response) => {
  try {
    const { listing } = req.body;
//edited ss
    const existing = await SavedListing.findOne({
      student: req.user?.id,
      listing,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already saved",
      });
    }

    const saved = await SavedListing.create({
      student: req.user?.id,
      listing,
    });

    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedListings = async (req: Request, res: Response) => {
  try {
    const savedListings = await SavedListing.find({
      student: req.user?.id,
    }).populate("listing");

    res.json(savedListings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSavedListing = async (req: Request, res: Response) => {
  try {
    const savedListing = await SavedListing.findById(req.params.id);

    if (!savedListing) {
      res.status(404).json({ message: "Saved listing not found" });
      return;
    }

    if (savedListing.student.toString() !== req.user?.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await savedListing.deleteOne();

    res.json({ message: "Saved listing removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// edited ss

export const getCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId)
      .populate("currentBoarding") as any;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user.currentBoarding || null);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// edited ss

export const updateCurrentBoarding = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        message: "listingId is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { currentBoarding: listingId },
      { new: true }
    ).populate("currentBoarding") as any;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: "Current boarding updated successfully",
      currentBoarding: user.currentBoarding,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

