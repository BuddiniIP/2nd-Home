import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reason: {
      type: String,
      required: true,
    },

    attachments: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },

    actionTaken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);