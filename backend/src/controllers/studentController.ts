import { Request, Response } from "express";
import SavedListing from "../models/SavedListing.js";

export const saveListing = async (req: Request, res: Response) => {
  try {
    const { listing } = req.body;

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