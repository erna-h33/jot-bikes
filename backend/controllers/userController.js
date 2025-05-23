import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';
import Booking from '../models/bookingModel.js';
import RentalAgreement from '../models/rentalAgreementModel.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, isVendor } = req.body;

  console.log('Register attempt:', { username, email, isVendor });

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists with email:', email);
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      isVendor: isVendor || false,
    });

    console.log('User created successfully:', user._id);

    if (user) {
      // Generate token
      const token = generateToken(res, user._id);
      console.log('Token generated for new user:', user._id);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isVendor: user.isVendor,
        token,
      });
    } else {
      console.log('Failed to create user');
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500);
    throw new Error(`Registration failed: ${error.message}`);
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  try {
    // Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found with email:', email);
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      console.log('Password does not match for user:', email);
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(res, user._id);
    console.log('Token generated successfully for user:', user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVendor: user.isVendor,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500);
    throw new Error(`Login failed: ${error.message}`);
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    console.log('Getting all users. Request user:', {
      id: req.user._id,
      isAdmin: req.user.isAdmin,
    });

    const users = await User.find({}).select('-password');
    console.log(`Found ${users.length} users`);

    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500);
    throw new Error(`Error fetching users: ${error.message}`);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Not authorized, admin');
    } else {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user details with rental history and agreements
// @route   GET /api/users/:id/details
// @access  Private/Admin
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get all bookings for this user
  const allBookings = await Booking.find({ user: req.params.id })
    .populate('product')
    .sort({ createdAt: -1 });

  // Filter out pending bookings
  const bookings = allBookings.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'completed'
  );

  // Get all rental agreements for this user
  const rentalAgreements = await RentalAgreement.find({
    'customer.email': user.email,
  }).populate('booking');

  // Calculate total spent (only from confirmed and completed bookings)
  const totalSpent = bookings.reduce((total, booking) => {
    return total + (booking.totalPrice || 0);
  }, 0);

  // Get rental history with status counts
  const rentalHistory = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: allBookings.filter((b) => b.status === 'cancelled').length,
  };

  res.json({
    user,
    bookings,
    rentalAgreements,
    totalSpent,
    rentalHistory,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserDetails,
};
