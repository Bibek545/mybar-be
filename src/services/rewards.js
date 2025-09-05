import User from "../models/user/userSchema.js";

// Config — easy to tweak later
const EARN_POINTS_PER_DOLLAR = 1;     // 1 pt per $1
const REDEEM_VALUE_PER_POINT = 0.10;  // $0.10 per point
const MIN_REDEEM_POINTS = 100;        // min block

export function dollarsFromPoints(points) {
  return Math.round(points * REDEEM_VALUE_PER_POINT * 100) / 100;
}

export function pointsFromDollars(dollars) {
  return Math.floor(dollars * EARN_POINTS_PER_DOLLAR);
}

export function clampRedeemable(requested, userBalance, subtotal) {
  const maxByBalance = Math.floor(userBalance);
  const maxBySubtotal = Math.floor(subtotal / REDEEM_VALUE_PER_POINT);
  const usable = Math.max(0, Math.min(requested, maxByBalance, maxBySubtotal));
  if (usable < MIN_REDEEM_POINTS) return 0;
  return usable;
}

export async function creditPoints(userId, points, dollars, reason, bookingId) {
  const p = Math.floor(points);
  if (p <= 0) return;
  await User.findByIdAndUpdate(
    userId,
    {
      $inc: { rewardPoints: p },
      $push: {
        rewardHistory: {
          $each: [{ type: "earn", points: p, dollars: Number(dollars) || 0, reason, bookingId }],
          $position: 0,
          $slice: 200, // keep last 200 entries
        },
      },
    },
    { new: true }
  );
}

export async function debitPoints(userId, points, dollars, reason, bookingId) {
  const p = Math.floor(points);
  if (p <= 0) return;
  await User.findByIdAndUpdate(
    userId,
    {
      $inc: { rewardPoints: -p },
      $push: {
        rewardHistory: {
          $each: [{ type: "redeem", points: p, dollars: Number(dollars) || 0, reason, bookingId }],
          $position: 0,
          $slice: 200,
        },
      },
    },
    { new: true }
  );
}
