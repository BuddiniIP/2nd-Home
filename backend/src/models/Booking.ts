import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "processing", "paid", "failed", "cancelled"],
      default: "unpaid",
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    stripeSessionId: {
      type: String,
      default: null,
    },

    month: { type: Number, default: null },
    year: { type: Number, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ student: 1 });
bookingSchema.index({ listing: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ student: 1, listing: 1, month: 1, year: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ student: 1, month: 1, year: 1 });

export default mongoose.model("Booking", bookingSchema);