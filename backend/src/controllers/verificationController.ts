import { RequestHandler } from "express";
import VerificationAssignment from "../models/VerificationAssignment.js";

export const assignVerifier: RequestHandler = async (req, res, next) => {
  try {
    const { verifierId, listingId, visitDate } = req.body;
    if (!verifierId || !listingId) {
      res.status(400).json({ message: "verifierId and listingId are required" });
      return;
    }
    const assignment = await VerificationAssignment.create({
      verifier: verifierId,
      listing: listingId,
      assignedBy: req.user!.id,
      visitDate: visitDate || null,
    });
    const populated = await VerificationAssignment.findById(assignment._id)
      .populate("listing", "title address")
      .populate("verifier", "firstName lastName email");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getMyAssignments: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await VerificationAssignment.find({ verifier: req.user!.id })
      .populate({
        path: "listing",
        select: "title address images owner",
        populate: { path: "owner", select: "firstName lastName email phone" },
      })
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const getAllAssignments: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await VerificationAssignment.find()
      .populate({
        path: "listing",
        select: "title address images owner",
        populate: { path: "owner", select: "firstName lastName email" },
      })
      .populate("verifier", "firstName lastName email")
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const submitInspection: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verdict, checklist, notes, selfie, images } = req.body;
    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    if (assignment.verifier.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    assignment.status = verdict === "verified" ? "verified" : "rejected";
    assignment.verdict = verdict;
    if (checklist) assignment.checklist = checklist;
    if (notes !== undefined) assignment.notes = notes;
    if (selfie) assignment.selfie = selfie;
    if (images) assignment.images = images;
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};
