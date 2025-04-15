import express from 'express';
import { processPayment, createPaymentIntent } from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/process', protect, processPayment);
router.post('/create-intent', protect, createPaymentIntent);

export default router;
