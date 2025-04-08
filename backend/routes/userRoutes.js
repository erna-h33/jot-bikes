import express from 'express';
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser).get(protect, getAllUsers);
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);

router.route('/profile').get(protect, getCurrentUserProfile).put(protect, updateCurrentUserProfile);

// ADMIN ROUTES
router
  .route('/:id')
  .delete(protect, deleteUserById)
  .get(protect, getUserById)
  .put(protect, updateUserById);

export default router;
