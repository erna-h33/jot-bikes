import Booking from '../models/bookingModel.js';
import Product from '../models/productModel.js';

// Helper to calculate number of weeks between two dates
function getWeeksBetween(startDate, endDate) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil((endDate - startDate) / msInWeek);
}

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { product: productId, startDate, endDate } = req.body;
    const userId = req.user._id;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      product: productId,
      $or: [{ startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }],
    });
    if (overlapping) {
      return res.status(400).json({ message: 'Product is already booked for these dates.' });
    }

    // Calculate total price (weekly price * number of weeks)
    const weeks = getWeeksBetween(new Date(startDate), new Date(endDate));
    const totalPrice = product.price * weeks;

    const booking = new Booking({
      user: userId,
      product: productId,
      startDate,
      endDate,
      totalPrice,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('product user');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only allow owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id (update status)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only allow owner or admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only allow owner or admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
