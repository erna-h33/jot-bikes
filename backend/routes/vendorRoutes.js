import express from 'express';
import formidable from 'express-formidable';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} from '../controllers/vendorController.js';
import { protect, vendor } from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure formidable
const formidableOptions = {
  encoding: 'utf-8',
  uploadDir: path.join(__dirname, '../../uploads'),
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  multiples: false,
  filter: function ({ name, originalFilename, mimetype }) {
    // Accept images only
    return mimetype && mimetype.includes('image/');
  },
};

// Vendor profile routes
router.route('/profile').get(protect, vendor, getVendorProfile);
router.route('/profile').put(protect, vendor, updateVendorProfile);

// Vendor product routes
router.route('/products').get(protect, vendor, getVendorProducts);
router.route('/products').post(protect, vendor, formidable(formidableOptions), createVendorProduct);
router
  .route('/products/:id')
  .put(protect, vendor, formidable(formidableOptions), updateVendorProduct);
router.route('/products/:id').delete(protect, vendor, deleteVendorProduct);

export default router;
