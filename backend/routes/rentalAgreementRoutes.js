import express from 'express';
import {
  createRentalAgreement,
  getRentalAgreementByBooking,
} from '../controllers/rentalAgreementController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createRentalAgreement);
router.route('/booking/:bookingId').get(protect, getRentalAgreementByBooking);

export default router;
