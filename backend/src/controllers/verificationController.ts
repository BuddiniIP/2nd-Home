import { RequestHandler } from "express";
import VerificationAssignment from "../models/VerificationAssignment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

const notify = async (recipient: any, type: any, title: any, message: any, link?: any, relatedId?: any) => {
  try {
    await Notification.create({ recipient, type, title, message, link: link || null, relatedId: relatedId || null } as any);
  } catch {
    /* silent */
  }
};

export const requestVerification: RequestHandler = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      res.status(400).json({ message: "listingId is required" });
      return;
    }

    const existing = await VerificationAssignment.findOne({
      listing: listingId,
      status: { $in: ["requested", "awaiting-availability", "ready-for-assignment", "assigned", "accepted", "in_progress"] },
    });
    if (existing) {
      res.status(400).json({ message: "A verification request already exists for this listing" });
      return;
    }

    const TEN_MIN = 10 * 60 * 1000;
    const staleCancelled = await VerificationAssignment.findOne({
      listing: listingId,
      status: "cancelled",
      cancelledAt: { $lt: new Date(Date.now() - TEN_MIN) },
    });
    if (staleCancelled) {
      staleCancelled.status = "expired-cancellation";
      await staleCancelled.save();
    }
    const stillBlocked = await VerificationAssignment.findOne({
      listing: listingId,
      status: "cancelled",
      cancelledAt: { $gte: new Date(Date.now() - TEN_MIN) },
    });
    if (stillBlocked) {
      const remaining = TEN_MIN - (Date.now() - new Date(stillBlocked.cancelledAt!).getTime());
      res.status(400).json({ message: `Please wait ${Math.ceil(remaining / 1000)} seconds before re-requesting verification.` });
      return;
    }

    const assignment = await VerificationAssignment.create({
      listing: listingId,
      owner: req.user!.id,
      status: "requested",
      ownerCancellableUntil: new Date(Date.now() + TWO_HOURS_MS),
      ownerAvailabilitySubmitted: false,
    });

    const admins = await (User as any).find({ role: "admin" });
    for (const admin of admins) {
      await notify(
        admin._id,
        "verification",
        "New Verification Request",
        "A boarding owner has requested verification for their property.",
        "/admin-dashboard?tab=verifiers",
        assignment._id
      );
    }

    const populated = await VerificationAssignment.findById(assignment._id)
      .populate("listing", "title address images")
      .populate("owner", "firstName lastName email phone");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const cancelOwnerRequest: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    if (assignment.owner?.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    if (assignment.status !== "requested") {
      res.status(400).json({ message: "Can only cancel a requested verification" });
      return;
    }
    if (Date.now() > new Date(assignment.ownerCancellableUntil!).getTime()) {
      res.status(400).json({ message: "Cancellation window has expired (2 hours)" });
      return;
    }

    assignment.status = "cancelled";
    assignment.cancelledAt = new Date();
    await assignment.save();

    res.json({ message: "Verification request cancelled", assignment });
  } catch (err) {
    next(err);
  }
};

export const setOwnerAvailability: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dateAvailable, timeSlot, notes } = req.body;

    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    if (assignment.owner?.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    if (assignment.status !== "awaiting-availability" && assignment.status !== "requested") {
      res.status(400).json({ message: "Cannot set availability in current status" });
      return;
    }

    assignment.ownerAvailability = {
      dateAvailable: dateAvailable ? new Date(dateAvailable) : null,
      timeSlot: timeSlot || "",
      notes: notes || "",
    };
    assignment.ownerAvailabilitySubmitted = true;
    assignment.status = "ready-for-assignment";
    await assignment.save();

    const adminList2 = await (User as any).find({ role: "admin" });
    for (const admin of adminList2) {
      await notify(
        admin._id,
        "verification",
        "Verification Availability Submitted",
        "An owner has submitted their availability for a verification visit. Ready to assign a verifier.",
        "/admin-dashboard?tab=verifiers",
        assignment._id
      );
    }

    const populated = await VerificationAssignment.findById(assignment._id)
      .populate("listing", "title address images")
      .populate("owner", "firstName lastName email phone");

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const getMyOwnerRequests: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await VerificationAssignment.find({ owner: req.user!.id })
      .populate({
        path: "listing",
        select: "title address images price",
      })
      .populate("verifier", "firstName lastName email phone profilePicture")
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const assignVerifier: RequestHandler = async (req, res, next) => {
  try {
    const { verifierId, listingId, visitDate } = req.body;
    if (!verifierId || !listingId) {
      res.status(400).json({ message: "verifierId and listingId are required" });
      return;
    }

    const assignment = await VerificationAssignment.findOne({
      listing: listingId,
      status: "ready-for-assignment",
    });
    if (!assignment) {
      res.status(400).json({ message: "No verification request ready for assignment for this listing" });
      return;
    }

    assignment.verifier = verifierId as any;
    assignment.assignedBy = req.user!.id as any;
    assignment.visitDate = visitDate ? new Date(visitDate) : null;
    assignment.status = "assigned";
    assignment.verifierResponseDeadline = new Date(Date.now() + FIFTEEN_MIN_MS);
    assignment.verifierAccepted = null;
    assignment.verifierCancelledAfterAccept = false;
    await assignment.save();

    await notify(
      verifierId,
      "verification",
      "New Verification Assignment",
      "You have been assigned to verify a boarding property. You have 15 minutes to accept or reject.",
      "/verifier-dashboard",
      assignment._id.toString()
    );

    const adminL = await (User as any).find({ role: "admin" });
    for (const admin of adminL) {
      if (String(admin._id) !== req.user!.id) {
        await notify(
          admin._id,
          "verification",
          "Verifier Assigned",
          "A verifier has been assigned to a boarding verification request.",
          "/admin-dashboard?tab=verifiers",
          assignment._id
        );
      }
    }

    const populated = await VerificationAssignment.findById(assignment._id)
      .populate("listing", "title address images")
      .populate("verifier", "firstName lastName email phone profilePicture")
      .populate("assignedBy", "firstName lastName");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const unassignVerifier: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    if (assignment.status !== "assigned" && assignment.status !== "accepted") {
      res.status(400).json({ message: "Can only unassign in assigned or accepted status" });
      return;
    }

    const verifierId = assignment.verifier?.toString();
    assignment.verifier = null as any;
    assignment.assignedBy = null as any;
    assignment.visitDate = null;
    assignment.status = "ready-for-assignment";
    assignment.verifierResponseDeadline = null;
    assignment.verifierAccepted = null;
    assignment.verifierAcceptedAt = null;
    assignment.verifierCancelledAfterAccept = false;
    await assignment.save();

    if (verifierId) {
      await notify(
        verifierId,
        "verification",
        "Assignment Removed",
        "Your verification assignment has been removed by the admin.",
        "/verifier-dashboard",
        assignment._id.toString()
      );
    }

    res.json({ message: "Verifier unassigned", assignment });
  } catch (err) {
    next(err);
  }
};

export const getPendingRequests: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await VerificationAssignment.find({
      status: "ready-for-assignment",
    })
      .populate({
        path: "listing",
        select: "title address images price isAvailable",
        populate: { path: "owner", select: "firstName lastName email phone" },
      })
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const getMyAssignments: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await VerificationAssignment.find({ verifier: req.user!.id })
      .populate({
        path: "listing",
        select: "title address images owner price",
        populate: { path: "owner", select: "firstName lastName email phone" },
      })
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    const now = Date.now();
    for (const a of assignments) {
      if (
        a.status === "assigned" &&
        a.verifierResponseDeadline &&
        now > new Date(a.verifierResponseDeadline).getTime() &&
        a.verifierAccepted === null
      ) {
        await VerificationAssignment.updateOne(
          { _id: a._id },
          { $set: { verifierAccepted: false, status: "ready-for-assignment", verifier: null } }
        );
        a.status = "ready-for-assignment";
        a.verifier = null;
        a.verifierAccepted = false;

        const listing: any = await Listing.findById(a.listing);
        await notify(
          req.user!.id,
          "verification",
          "Assignment Expired",
          `You missed the 15-minute window to respond to the verification for "${listing?.title || 'boarding'}".`,
          "/verifier-dashboard",
          a._id
        );
      }
    }

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
      .populate("verifier", "firstName lastName email phone profilePicture")
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const respondToAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;

    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    if (!assignment.verifier || assignment.verifier.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    if (assignment.status !== "assigned") {
      res.status(400).json({ message: "Assignment is not in a pending state" });
      return;
    }
    if (
      assignment.verifierResponseDeadline &&
      Date.now() > new Date(assignment.verifierResponseDeadline).getTime()
    ) {
      assignment.status = "ready-for-assignment";
      assignment.verifier = null as any;
      assignment.verifierAccepted = false;
      await assignment.save();
      res.status(400).json({ message: "Response window has expired (15 minutes)" });
      return;
    }

    assignment.verifierAccepted = accept;
    if (accept) {
      assignment.status = "accepted";
      assignment.verifierAcceptedAt = new Date();

      const listing: any = await Listing.findById(assignment.listing).populate("owner", "firstName lastName email phone");
      const verifier: any = await User.findById(req.user!.id);

      if (listing && listing.owner) {
        const ownerId = listing.owner?._id || listing.owner;
        await notify(
          ownerId,
          "verification",
          "Verifier Accepted",
          `A verifier has been assigned to verify your property "${listing.title}".`,
          "/owner-dashboard?tab=verifications",
          assignment._id
        );
      }

      const adminAccept = await (User as any).find({ role: "admin" });
      for (const admin of adminAccept) {
        await notify(
          admin._id,
          "verification",
          "Verifier Accepted Assignment",
          `Verifier ${verifier?.firstName || ''} ${verifier?.lastName || ''} has accepted the verification assignment.`,
          "/admin-dashboard?tab=verifiers",
          assignment._id
        );
      }
    } else {
      assignment.status = "ready-for-assignment";
      const oldVerifierId = assignment.verifier;
      assignment.verifier = null as any;
      assignment.assignedBy = null as any;
      assignment.visitDate = null;
      assignment.verifierResponseDeadline = null;

      const adminReject = await (User as any).find({ role: "admin" });
      for (const admin of adminReject) {
        await notify(
          admin._id,
          "verification",
          "Verifier Rejected Assignment",
          "A verifier has rejected the verification assignment. The request is available for reassignment.",
          "/admin-dashboard?tab=verifiers",
          assignment._id
        );
      }
    }

    await assignment.save();

    const populated = await VerificationAssignment.findById(assignment._id)
      .populate({
        path: "listing",
        select: "title address images owner",
        populate: { path: "owner", select: "firstName lastName email phone" },
      })
      .populate("verifier", "firstName lastName email phone profilePicture")
      .populate("assignedBy", "firstName lastName");

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const cancelAcceptedAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await VerificationAssignment.findById(id);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
      return;
    }
    if (!assignment.verifier || assignment.verifier.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    if (assignment.status !== "accepted") {
      res.status(400).json({ message: "Can only cancel an accepted assignment" });
      return;
    }

    assignment.verifierCancelledAfterAccept = true;
    assignment.redFlag = true;
    assignment.status = "ready-for-assignment";
    assignment.verifier = null as any;
    assignment.assignedBy = null as any;
    assignment.visitDate = null;
    assignment.verifierResponseDeadline = null;
    assignment.verifierAccepted = null;
    assignment.verifierAcceptedAt = null;
    await assignment.save();

    const adminFlag = await (User as any).find({ role: "admin" });
    for (const admin of adminFlag) {
      await notify(
        admin._id,
        "verification",
        "Verifier Red Flag",
        "A verifier cancelled after accepting an assignment. Red flag recorded.",
        "/admin-dashboard?tab=verifiers",
        assignment._id
      );
    }

    res.json({ message: "Assignment cancelled. Red flag recorded.", assignment });
  } catch (err) {
    next(err);
  }
};

export const uploadInspectionImage: RequestHandler = async (req, res, next) => {
  try {
    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    res.json({ url: file.path });
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
    if (!assignment.verifier || assignment.verifier.toString() !== req.user!.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }
    if (assignment.status !== "accepted" && assignment.status !== "in_progress") {
      res.status(400).json({ message: "Cannot submit inspection in current status" });
      return;
    }

    assignment.status = verdict === "verified" ? "verified" : "rejected";
    assignment.verdict = verdict;
    if (checklist) assignment.checklist = checklist;
    if (notes !== undefined) assignment.notes = notes;
    if (selfie) assignment.selfie = selfie;
    if (images) assignment.images = images;
    await assignment.save();

    if (assignment.owner) {
      const listing: any = await Listing.findById(assignment.listing);
      const verifier: any = await User.findById(assignment.verifier);
      await notify(
        assignment.owner,
        "verification",
        `Verification ${verdict === "verified" ? "Passed" : "Failed"}`,
        `Your property "${listing?.title || 'boarding'}" has been ${verdict === "verified" ? "verified successfully" : "rejected during inspection"} by verifier ${verifier?.firstName || ''} ${verifier?.lastName || ''}.`,
        "/owner-dashboard?tab=verifications",
        assignment._id
      );
    }

    // Notify admin
    const adminInspect = await (User as any).find({ role: "admin" });
    for (const admin of adminInspect) {
      await notify(
        admin._id,
        "verification",
        `Inspection ${verdict === "verified" ? "Completed" : "Rejected"}`,
        `A verification inspection has been completed with verdict: ${verdict}.`,
        "/admin-dashboard?tab=verifiers",
        assignment._id
      );
    }

    res.json(assignment);
  } catch (err) {
    next(err);
  }
};
