import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["general", "verification", "report", "support"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    relatedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model("Message", messageSchema);
