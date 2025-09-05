// controllers/bookingController.js
import {
  createBooking,
  listBookingsByUser,
  getBookingById,
  updateBookingById,
} from "../models/bookings/bookingModel.js";
import User from "../models/user/userSchema.js";
import {
  sendBookingCancelled,
  sendBookingReceived,
} from "../services/emailService.js";
import {
  clampRedeemable,
  debitPoints,
  dollarsFromPoints,
} from "../services/rewards.js";


export const createBookingController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      guests,
      date,
      time,
      allergies,
      notes,
      eventId,
    } = req.body;

    if (!name || !email || !guests || !date || !time) {
      return res.status(400).json({
        status: "error",
        message: "name, email, guests, date and time are required.",
      });
    }

    const booking = await createBooking({
      name: (name || "").trim(),
      email: (email || "").trim().toLowerCase(),
      phone: (phone || "").trim(),
      guests: Number(guests),
      date: new Date(date), // "YYYY-MM-DD" is fine
      time, // "HH:mm" or "7:00 PM" (as you store)
      allergies: (allergies || "").trim(),
      notes: (notes || "").trim(),
      eventId: eventId || undefined,
      source: "web",
      status: "pending",
    });

    // Fire-and-forget email (don’t block the response)
    (async () => {
      try {
        await sendBookingReceived({
          email: booking.email,
          name: booking.name,
          date: booking.date.toISOString().slice(0, 10), // YYYY-MM-DD for email copy
          time: booking.time,
          guests: booking.guests,
        });
      } catch (e) {
        console.error("[email booking-received] ", e.message);
      }
    })();

    return res.json({
      status: "success",
      message: "Thank you! Your booking is received.",
      data: booking,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "Booking failed." });
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
      subtotal = 0, // known price if applicable
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
          // Lookup latest balance for email
          const userFresh = await User.findById(u._id).select(
            "rewardPoints name email"
          );
          await sendRewardsDelta({
            email: userFresh.email,
            name: userFresh.name || "Member",
            deltaPoints: -appliedPoints, // redeemed
            balance: userFresh.rewardPoints || 0,
            reason: "Booking redemption",
          });
        } catch (e) {
          console.error("[email rewards-delta] ", e.message);
        }
      })();
    }

    // Email: booking received
    (async () => {
      try {
        await sendBookingReceived({
          email: booking.email,
          name: booking.name,
          date: booking.date.toISOString().slice(0, 10),
          time: booking.time,
          guests: booking.guests,
        });
      } catch (e) {
        console.error("[email booking-received] ", e.message);
      }
    })();

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
          date: updated.date?.toISOString
            ? updated.date.toISOString().slice(0, 10)
            : b.date, // fallback if needed
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
