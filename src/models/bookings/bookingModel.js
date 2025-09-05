import Booking from "./bookingSchema.js";

// Create
export const createBooking = (data) => new Booking(data).save();

// Admin: list all
export const getAllBookings = () =>
  Booking.find().sort({ createdAt: -1 });

// Member: list mine
export const listBookingsByUser = (userId) =>
  Booking.find({ userId }).sort({ date: 1, time: 1 });

// Read one
export const getBookingById = (id) => Booking.findById(id);

// Update one
export const updateBookingById = (id, update) =>
  Booking.findByIdAndUpdate(id, update, { new: true });

// Delete one
export const deleteBookingById = (id) => Booking.findByIdAndDelete(id);
