import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAllBookings,
  getStockStatus,
  getVendorBookings,
} from '../controllers/bookingController.js';
import { protect, admin, vendor } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin route to get all bookings
router.get('/', protect, admin, getAllBookings);

// Get stock status (admin only)
router.get('/stock-status', protect, admin, getStockStatus);

// Create a booking
router.post('/', protect, createBooking);

// Get bookings for the logged-in user
router.get('/my-bookings', protect, getMyBookings);

// Get vendor bookings
router.get('/vendor', protect, vendor, getVendorBookings);

// Get, update, or delete a single booking
router
  .route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBookingStatus)
  .delete(protect, deleteBooking);

export default router;
