import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    }, // Optional
    guests: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String },
    // add these fields inside your existing schema definition
    subtotal: { type: Number, default: 0 }, // known price (optional)
    appliedPoints: { type: Number, default: 0 }, // points used on create
    discountAmount: { type: Number, default: 0 }, // dollars knocked off
    totalPaid: { type: Number, default: 0 }, // what member actually paid
    pointsCredited: { type: Boolean, default: false }, // prevent double awarding
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
