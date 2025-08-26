import { createBooking } from "../models/bookings/bookingModel.js";

export const createBookingController = async (req, res) => {
  try {
    // If using authGuard middleware, req.user will be set for logged-in members
    const userId = req.user?._id; // undefined if not logged in

    const { name, email, phone, guests, date, time, specialRequests } =
      req.body;
    if (!name || !email || !phone || !guests || !date || !time) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "All required fields must be filled.",
        });
    }

    const booking = await createBooking({
      name,
      email,
      phone,
      guests,
      date,
      time,
      specialRequests,
      user: userId || null, // Only set if logged in!
    });

    res.json({
      status: "success",
      message: "Thank you! Your booking is received.",
      data: booking,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Booking failed." });
  }
};
