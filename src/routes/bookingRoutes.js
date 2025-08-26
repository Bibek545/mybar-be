import express from 'express';
import { createBookingController } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBookingController);

export default router;