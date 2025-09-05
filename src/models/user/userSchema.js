import mongoose from "mongoose";
const rewardHistorySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["earn", "redeem", "reversal"], required: true },
    points: { type: Number, required: true },
    dollars: { type: Number, default: 0 },
    reason: { type: String },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      indexe: 1,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    image: {
      type: String,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshJWT: {
      type: String,
    },
    rewardPoints: { type: Number, default: 0 }, // current balance
    rewardHistory: { type: [rewardHistorySchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
