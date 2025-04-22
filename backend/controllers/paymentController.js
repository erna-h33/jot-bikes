import Stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Booking from '../models/bookingModel.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key available:', !!stripeKey); // Debug log

if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
});

// @desc    Process payment
// @route   POST /api/payment/process
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { paymentMethodId, amount, bookingId } = req.body;

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === 'succeeded') {
      // If bookingId is provided, update the booking status to confirmed
      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking) {
          if (booking.status !== 'pending') {
            return res.status(400).json({
              success: false,
              message: 'Booking is not in pending status',
            });
          }
          booking.status = 'confirmed';
          await booking.save();
        }
      }

      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export { processPayment, createPaymentIntent };
