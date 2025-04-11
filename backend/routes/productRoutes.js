import express from 'express';
import formidable from 'express-formidable';
const router = express.Router();

// Controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from '../controllers/productController.js';

// Middleware
import { protect, admin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';

// Routes
router.route('/').get(fetchProducts).post(protect, admin, formidable(), addProduct);

router.route('/allproducts').get(fetchAllProducts);
router.route('/:id/reviews').post(protect, checkId, addProductReview);

router.get('/top', fetchTopProducts);
router.get('/new', fetchNewProducts);

router
  .route('/:id')
  .get(fetchProductById)
  .put(protect, admin, formidable(), updateProductDetails)
  .delete(protect, admin, removeProduct);

export default router;
