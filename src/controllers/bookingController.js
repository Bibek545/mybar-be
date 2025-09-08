// controllers/bookingController.js
import {
  createBooking,
  listBookingsByUser,
  getBookingById,
  updateBookingById,
} from "../models/bookings/bookingModel.js";
import User from "../models/user/userSchema.js";
import {
  sendBookingAlertToAdmin,
  sendBookingCancelled,
  sendBookingReceived,
} from "../services/emailService.js";
import { bookingReceivedTemplate } from "../services/emailTemplates.js";
import {
  clampRedeemable,
  debitPoints,
  dollarsFromPoints,
} from "../services/rewards.js";


export const createBookingController = async (req, res) => {
  try {
    console.log("[booking] hit");
    console.log("[booking] payload:", req.body);

    const {
      name,
      email,           // may be missing on members route
      phone,
      guests,
      date,            // keep as string
      time,
      allergies,
      notes,
      eventId,
    } = req.body;

    // if members route, fall back to authenticated user email
    const targetEmail = (email || req.user?.email || "").trim().toLowerCase();

    if (!name || !targetEmail || !guests || !date || !time) {
      console.warn("[booking] missing fields", { name, targetEmail, guests, date, time });
      return res.status(400).json({
        status: "error",
        message: "name, email, guests, date and time are required.",
      });
    }

    const booking = await createBooking({
      name: (name || "").trim(),
      email: targetEmail,
      phone: (phone || "").trim(),
      guests: Number(guests),
      date,                 // store the string as-is
      time,
      allergies: (allergies || "").trim(),
      notes: (notes || "").trim(),
      eventId: eventId || undefined,
      source: "web",
      status: "pending",
    });

    console.log("[booking] created:", booking._id?.toString());

    // TEMP: await and hard-log so we SEE errors
    await sendBookingReceived({
      email: booking.email,     // guaranteed non-empty now
      name: booking.name,
      date: booking.date,       // plain string
      time: booking.time,
      guests: booking.guests,
    });

    console.log("[booking] confirmation email sent");

    return res.json({
      status: "success",
      message: "Thank you! Your booking is received.",
      data: booking,
    });
  } catch (err) {
    console.error("[booking] ERROR", {
      msg: err.message,
      code: err.code,
      response: err.response,
      responseCode: err.responseCode,
      stack: err.stack,
    });
    return res.status(500).json({ status: "error", message: "Booking failed." });
  }
};


/**
 * MEMBER: create with optional redeem
 * Sends: booking received; rewards-delta (if points redeemed)
 */
export const createMemberBookingController = async (req, res, next) => {
  try {
    const u = req.userInfo; // set by userAuthMiddleware
    const {
      date,
      time,
      guests,
      allergies = "",
      notes = "",
      subtotal = 0,
      redeemPoints = 0,
      eventId,
    } = req.body;

    if (!date || !time || !guests) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields." });
    }

    let appliedPoints = 0;
    let discountAmount = 0;

    if (Number(subtotal) > 0 && Number(redeemPoints) > 0) {
      const fresh = await User.findById(u._id).select("rewardPoints");
      const usable = clampRedeemable(
        redeemPoints,
        fresh?.rewardPoints || 0,
        subtotal
      );
      if (usable > 0) {
        appliedPoints = usable;
        discountAmount = dollarsFromPoints(usable);
      }
    }

    const booking = await createBooking({
      userId: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      date: new Date(date),
      time,
      guests: Number(guests),
      allergies: allergies.trim(),
      notes: notes.trim(),
      eventId: eventId || undefined,
      source: "member",
      status: "pending",
      subtotal: Number(subtotal) || 0,
      appliedPoints,
      discountAmount,
      totalPaid: Math.max(0, (Number(subtotal) || 0) - discountAmount),
    });

    // Deduct points if applied
    if (appliedPoints > 0) {
      await debitPoints(
        u._id,
        appliedPoints,
        discountAmount,
        "Booking redemption",
        booking._id
      );

      // Email: rewards delta (redeemed)
      (async () => {
        try {
          const userFresh = await User.findById(u._id).select(
            "rewardPoints name email"
          );
          await sendRewardsDelta({
            email: userFresh.email,
            name: userFresh.name || "Member",
            deltaPoints: -appliedPoints,
            balance: userFresh.rewardPoints || 0,
            reason: "Booking redemption",
          });
        } catch (e) {
          console.error("[email rewards-delta]", e.message);
        }
      })();
    }

    // 📧 Debug lines
    console.log("ADMIN_EMAIL =", process.env.ADMIN_EMAIL);
    console.log("Has sendBookingAlertToAdmin =", typeof sendBookingAlertToAdmin);

    // Send customer + admin emails together
    const displayName =
      booking.name || u?.name || (u?.email?.split("@")[0]) || "there";

    Promise.allSettled([
      sendBookingReceived({
        email: booking.email,
        name: displayName,
        date: String(booking.date),
        time: booking.time,
        guests: booking.guests,
      }),
      sendBookingAlertToAdmin({
        email: process.env.ADMIN_EMAIL, // set in .env
        booking,
      }),
    ]).then(results => {
      const labels = ["customer-received", "admin-alert"];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          console.log(`[email ${labels[i]}] sent`);
        } else {
          console.error(`[email ${labels[i]}] failed`, r.reason);
        }
      });
    }).catch(err => {
      console.error("[email all] unexpected error", err);
    });

    return res.json({
      status: "success",
      data: booking,
      message: "Booking created.",
    });
  } catch (error) {
    next(error);
  }
};



/**
 * MEMBER: list my bookings (auth)
 */
export const getMyBookingsController = async (req, res, next) => {
  try {
    const list = await listBookingsByUser(req.userInfo._id);
    return res.json({ status: "success", data: list });
  } catch (e) {
    next(e);
  }
};

/**
 * MEMBER: cancel my booking (auth)
 * Sends: booking cancelled
 */
export const cancelMyBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const b = await getBookingById(id);
    if (!b) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    if (!b.userId || String(b.userId) !== String(req.userInfo._id)) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    const updated = await updateBookingById(id, { status: "cancelled" });

    // Email: booking cancelled
    (async () => {
      try {
        await sendBookingCancelled({
          email: updated.email,
          name: updated.name,
date: String(updated.date ?? ""), // safe string

          time: updated.time || b.time,
        });
      } catch (e) {
        console.error("[email booking-cancelled] ", e.message);
      }
    })();

    return res.json({ status: "success", data: updated });
  } catch (e) {
    next(e);
  }
};
