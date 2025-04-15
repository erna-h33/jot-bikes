import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getUserBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/status').put(protect, admin, updateBookingStatus);
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
