import Booking from "./bookingSchema.js";

// Create a new booking (public user or admin)
export const createBooking = (data) => {
  return new Booking(data).save();
};

// Get all bookings (admin dashboard)
export const getAllBookings = () => {
  return Booking.find().sort({ createdAt: -1 }); // Newest first
};

// Update booking by ID (for admin: status, notes, etc)
export const updateBookingById = (id, update) => {
  return Booking.findByIdAndUpdate(id, update, { new: true });
};

// Delete booking by ID (admin only)
export const deleteBookingById = (id) => {
  return Booking.findByIdAndDelete(id);
};

// Get a booking by ID (if you want detail page/view)
export const getBookingById = (id) => {
  return Booking.findById(id);
};
