import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a booking
router.post('/', protect, createBooking);
// Get bookings for the logged-in user
router.get('/my', protect, getMyBookings);
// Get, update, or delete a single booking
router
  .route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBookingStatus)
  .delete(protect, deleteBooking);

export default router;
