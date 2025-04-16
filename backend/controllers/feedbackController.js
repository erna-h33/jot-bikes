import asyncHandler from '../middlewares/asyncHandler.js';
import Feedback from '../models/feedbackModel.js';

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = asyncHandler(async (req, res) => {
  const { type, subject, message, category, priority } = req.body;

  const feedback = await Feedback.create({
    user: req.user._id,
    type,
    subject,
    message,
    category,
    priority,
  });

  if (feedback) {
    res.status(201).json(feedback);
  } else {
    res.status(400);
    throw new Error('Invalid feedback data');
  }
});

// @desc    Get all feedback (admin/vendor)
// @route   GET /api/feedback
// @access  Private/Admin/Vendor
const getAllFeedback = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { subject: { $regex: req.query.keyword, $options: 'i' } },
          { message: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await Feedback.countDocuments({ ...keyword });
  const feedback = await Feedback.find({ ...keyword })
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ feedback, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get user feedback
// @route   GET /api/feedback/my
// @access  Private
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id })
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(feedback);
});

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name email');

  if (feedback) {
    res.json(feedback);
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

// @desc    Update feedback status
// @route   PUT /api/feedback/:id/status
// @access  Private/Admin/Vendor
const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status, assignedTo } = req.body;

  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    feedback.status = status || feedback.status;
    feedback.assignedTo = assignedTo || feedback.assignedTo;

    const updatedFeedback = await feedback.save();
    res.json(updatedFeedback);
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

// @desc    Add response to feedback
// @route   POST /api/feedback/:id/respond
// @access  Private/Admin/Vendor
const respondToFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    feedback.response = {
      message,
      respondedBy: req.user._id,
      respondedAt: Date.now(),
    };
    feedback.status = 'resolved';

    const updatedFeedback = await feedback.save();
    res.json(updatedFeedback);
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private/Admin/Vendor
const getFeedbackStats = asyncHandler(async (req, res) => {
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
        },
        byType: {
          $push: {
            type: '$type',
            count: 1,
          },
        },
        byCategory: {
          $push: {
            category: '$category',
            count: 1,
          },
        },
      },
    },
  ]);

  res.json(
    stats[0] || {
      total: 0,
      pending: 0,
      resolved: 0,
      inProgress: 0,
      byType: [],
      byCategory: [],
    }
  );
});

export {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  respondToFeedback,
  deleteFeedback,
  getFeedbackStats,
};
