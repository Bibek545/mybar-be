import express from 'express';
import { cancelMyBookingController, createBookingController, createMemberBookingController, getMyBookingsController } from '../controllers/bookingController.js';
import { userAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createBookingController);

// MEMBER (requires auth)
router.post("/members", userAuthMiddleware, createMemberBookingController);
router.get("/members/me", userAuthMiddleware, getMyBookingsController);
router.patch("/members/:id/cancel", userAuthMiddleware, cancelMyBookingController);

export default router;