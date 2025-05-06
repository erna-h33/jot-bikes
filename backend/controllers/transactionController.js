import asyncHandler from '../middlewares/asyncHandler.js';
import Transaction from '../models/transactionModel.js';

// @desc    Get vendor transactions
// @route   GET /api/transactions/vendor
// @access  Private/Vendor
const getVendorTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ vendor: req.user._id })
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .sort('-createdAt');

  res.json(transactions);
});

// @desc    Get admin transactions
// @route   GET /api/transactions/admin
// @access  Private/Admin
const getAdminTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('user', 'name email')
    .populate('vendor', 'name email')
    .populate('items.product', 'name')
    .sort('-createdAt');

  res.json(transactions);
});

// @desc    Get user transactions
// @route   GET /api/transactions/my-transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate('vendor', 'name email')
    .populate('items.product', 'name')
    .sort('-createdAt');

  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('user', 'name email')
    .populate('vendor', 'name email')
    .populate('items.product', 'name');

  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

export { getVendorTransactions, getAdminTransactions, getUserTransactions, getTransactionById };
