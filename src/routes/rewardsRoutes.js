// routes/rewardsRoutes.js
import { Router } from "express";
// import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";
import User from "../models/user/userSchema.js";
import { clampRedeemable, dollarsFromPoints } from "../services/rewards.js";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";
// import { clampRedeemable, dollarsFromPoints } from "../src/services/rewards.js";

const router = Router();

router.get("/me", userAuthMiddleware, async (req, res) => {
  const u = await User.findById(req.userInfo._id).select("rewardPoints rewardHistory name email");
  res.json({ status: "success", data: u });
});

router.post("/preview", userAuthMiddleware, async (req, res) => {
  const { subtotal = 0, redeemPoints = 0 } = req.body;
  const u = await User.findById(req.userInfo._id).select("rewardPoints");
  const usable = clampRedeemable(redeemPoints, u?.rewardPoints || 0, subtotal);
  res.json({
    status: "success",
    data: {
      requested: Number(redeemPoints),
      usable,
      discount: dollarsFromPoints(usable),
      remainingAfterUse: (Number(u?.rewardPoints || 0) - usable),
    },
  });
});

export default router;
