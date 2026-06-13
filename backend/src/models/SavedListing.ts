import mongoose from "mongoose";

const savedListingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a student can only save a given listing once
savedListingSchema.index({ student: 1, listing: 1 }, { unique: true });
export default mongoose.model("SavedListing", savedListingSchema);