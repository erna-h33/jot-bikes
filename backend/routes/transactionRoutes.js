import express from 'express';
import {
  getVendorTransactions,
  getAdminTransactions,
  getUserTransactions,
  getTransactionById,
} from '../controllers/transactionController.js';
import { protect, admin, vendor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/vendor').get(protect, vendor, getVendorTransactions);
router.route('/admin').get(protect, admin, getAdminTransactions);
router.route('/my-transactions').get(protect, getUserTransactions);
router.route('/:id').get(protect, getTransactionById);

export default router;
