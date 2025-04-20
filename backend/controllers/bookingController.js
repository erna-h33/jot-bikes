import Booking from '../models/bookingModel.js';
import Product from '../models/productModel.js';

// Helper to calculate number of weeks between two dates
function getWeeksBetween(startDate, endDate) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil((endDate - startDate) / msInWeek);
}

// Helper to get available stock for a product on specific dates
async function getAvailableStock(productId, startDate, endDate) {
  const product = await Product.findById(productId);
  if (!product) return 0;

  const existingBookings = await Booking.countDocuments({
    product: productId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
      },
    ],
  });

  return Math.max(0, product.countInStock - existingBookings);
}

// GET /api/bookings/stock-status
export const getStockStatus = async (req, res) => {
  try {
    const products = await Product.find();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stockStatus = await Promise.all(
      products.map(async (product) => {
        const availableStock = await getAvailableStock(product._id, today, nextWeek);
        return {
          _id: product._id,
          name: product.name,
          totalStock: product.countInStock,
          availableStock,
          isLowStock: availableStock < 5,
        };
      })
    );

    const lowStockProducts = stockStatus.filter((p) => p.isLowStock);

    res.json({
      allProducts: stockStatus,
      lowStockAlert:
        lowStockProducts.length > 0
          ? {
              message: `${lowStockProducts.length} products have less than 5 units available`,
              products: lowStockProducts,
            }
          : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Count existing bookings for the same date range
    const existingBookings = await Booking.countDocuments({
      product: productId,
      status: { $ne: 'cancelled' }, // Don't count cancelled bookings
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    // Check if there's enough stock available
    if (existingBookings >= product.countInStock) {
      return res.status(400).json({
        message: 'No available stock for these dates. All units are booked.',
      });
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
    if (!['confirmed', 'cancelled'].includes(status)) {
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

// GET /api/bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('product')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/vendor
export const getVendorBookings = async (req, res) => {
  try {
    // First get all products owned by the vendor
    const vendorProducts = await Product.find({ vendor: req.user._id }).select('_id');
    const productIds = vendorProducts.map((product) => product._id);

    // Then get all bookings for these products
    const bookings = await Booking.find({ product: { $in: productIds } })
      .populate('product')
      .populate('user', 'username email name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
