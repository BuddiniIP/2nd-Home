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

export default mongoose.model("SavedListing", savedListingSchema);