import Stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';
import env from '../config/env.js';

const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
});

// @desc    Process payment
// @route   POST /api/payment/process
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = 'usd' } = req.body;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${env.frontendUrl}/order-success`,
    });

    if (paymentIntent.status === 'succeeded') {
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
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
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
