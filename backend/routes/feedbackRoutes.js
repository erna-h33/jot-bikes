import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  respondToFeedback,
  deleteFeedback,
  getFeedbackStats,
} from '../controllers/feedbackController.js';
import { protect, admin, vendor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createFeedback).get(protect, admin, getAllFeedback);

router.route('/my').get(protect, getMyFeedback);
router.route('/stats').get(protect, admin, getFeedbackStats);

router.route('/:id').get(protect, getFeedbackById).delete(protect, admin, deleteFeedback);

router.route('/:id/status').put(protect, admin, updateFeedbackStatus);
router.route('/:id/respond').post(protect, admin, respondToFeedback);

// Vendor routes
router.route('/vendor').get(protect, vendor, getAllFeedback);
router.route('/vendor/stats').get(protect, vendor, getFeedbackStats);
router.route('/vendor/:id/status').put(protect, vendor, updateFeedbackStatus);
router.route('/vendor/:id/respond').post(protect, vendor, respondToFeedback);

export default router;
