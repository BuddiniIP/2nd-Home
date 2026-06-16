import mongoose from "mongoose";

const verificationAssignmentSchema = new mongoose.Schema(
  {
    verifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "verified", "rejected"],
      default: "pending",
    },
    visitDate: { type: Date, default: null },
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

export default mongoose.model("VerificationAssignment", verificationAssignmentSchema);
