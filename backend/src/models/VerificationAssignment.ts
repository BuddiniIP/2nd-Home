import mongoose from "mongoose";

const verificationAssignmentSchema = new mongoose.Schema(
  {
    verifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "cancelled",
        "expired-cancellation",
        "awaiting-availability",
        "ready-for-assignment",
        "assigned",
        "accepted",
        "in_progress",
        "verified",
        "rejected",
      ],
      default: "requested",
    },
    visitDate: { type: Date, default: null },
    ownerCancellableUntil: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    ownerAvailability: {
      dateAvailable: { type: Date, default: null },
      timeSlot: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    ownerAvailabilitySubmitted: { type: Boolean, default: false },
    verifierResponseDeadline: { type: Date, default: null },
    verifierAccepted: { type: Boolean, default: null },
    verifierAcceptedAt: { type: Date, default: null },
    verifierCancelledAfterAccept: { type: Boolean, default: false },
    redFlag: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    checklist: { type: [String], default: [] },
    verdict: {
      type: String,
      enum: [null, "verified", "rejected"],
      default: null,
    },
    selfie: { type: String, default: null },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

verificationAssignmentSchema.index({ verifier: 1, status: 1 });
verificationAssignmentSchema.index({ status: 1, createdAt: -1 });
verificationAssignmentSchema.index({ owner: 1, status: 1 });

export default mongoose.model("VerificationAssignment", verificationAssignmentSchema);
