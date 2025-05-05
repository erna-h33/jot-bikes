import asyncHandler from '../middlewares/asyncHandler.js';
import Product from '../models/productModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Booking from '../models/bookingModel.js';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduct = async (req, res) => {
  try {
    const { name, description, brand, price, category, countInStock, size, color, salePrice } =
      req.fields || req.body;

    // Validate required fields
    if (!name || !description || !brand || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Set default image path
    let image = '/uploads/default.jpg';

    // If an image was uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'jot-bikes',
          resource_type: 'auto',
        });

        // Use the Cloudinary URL
        image = result.secure_url;
        console.log('Image uploaded to Cloudinary:', image);

        // Clean up the temporary file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      }
    }

    const product = new Product({
      name,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      description,
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      size,
      color,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, price, category, countInStock, size, color, salePrice } =
      req.fields;

    // Find the product
    const product = await Product.findById(req.params.id);

    if (product) {
      // Create an object with the fields to update
      const updateData = {};

      // Only update fields that are provided
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (brand) updateData.brand = brand;
      if (price) updateData.price = Number(price);
      if (salePrice !== undefined) updateData.salePrice = salePrice ? Number(salePrice) : null;
      if (category) updateData.category = category;
      if (countInStock !== undefined) updateData.countInStock = Number(countInStock);
      if (size) updateData.size = size;
      if (color) updateData.color = color;

      // Handle image upload
      if (req.files && req.files.image) {
        const file = req.files.image;
        console.log('Image file received:', file);

        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'jot-bikes',
            resource_type: 'auto',
          });

          // Use the Cloudinary URL
          updateData.image = result.secure_url;
          console.log('Image uploaded to Cloudinary:', updateData.image);

          // Clean up the temporary file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }
      }

      // Update the product fields
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: false }
      );

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error in updateProductDetails:', error);
    res.status(400).json({ message: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    console.log('Attempting to delete product with ID:', req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.error('Product not found for deletion');
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully');
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate('category')
      .populate('vendor', 'name email vendorName')
      .limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('vendor', 'name email vendorName');
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Product not found' });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category')
      .populate('vendor', 'name email vendorName')
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({ error: 'Product already reviewed' });
      }
      const review = {
        name: req.user.username || req.user.name || 'Anonymous User',
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    // Get products with ratings, sorted by rating
    const ratedProducts = await Product.find({ rating: { $exists: true, $ne: null } })
      .populate('category')
      .populate('vendor', 'name email vendorName')
      .sort({ rating: -1 })
      .limit(6);

    // Get newer products without ratings
    const newProducts = await Product.find({
      $or: [{ rating: { $exists: false } }, { rating: null }],
    })
      .populate('category')
      .populate('vendor', 'name email vendorName')
      .sort({ createdAt: -1 })
      .limit(6);

    // Combine and deduplicate products
    const allProducts = [...ratedProducts];
    newProducts.forEach((product) => {
      if (!allProducts.find((p) => p._id.toString() === product._id.toString())) {
        allProducts.push(product);
      }
    });

    // Limit to 6 products total
    const products = allProducts.slice(0, 6);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category')
      .populate('vendor', 'name email vendorName')
      .sort({ _id: -1 })
      .limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio, $lte: radio[1] };
    const products = await Product.find(args)
      .populate('category')
      .populate('vendor', 'name email vendorName');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const getFSNAnalysis = asyncHandler(async (req, res) => {
  try {
    // Get all products
    const products = await Product.find({}).populate('category');

    // Get all bookings from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await Booking.find({
      createdAt: { $gte: sixMonthsAgo },
      status: 'confirmed',
    });

    // Calculate booking frequency for each product
    const productBookings = {};
    bookings.forEach((booking) => {
      const productId = booking.product.toString();
      if (!productBookings[productId]) {
        productBookings[productId] = 0;
      }
      productBookings[productId]++;
    });

    // Categorize products as Fast, Slow, or Non-moving
    const fsnAnalysis = {
      fast: [],
      slow: [],
      nonMoving: [],
    };

    products.forEach((product) => {
      const bookingCount = productBookings[product._id.toString()] || 0;
      const productData = {
        _id: product._id,
        name: product.name,
        category: product.category.name,
        countInStock: product.countInStock,
        bookingCount,
        lastBooked:
          bookings
            .filter((b) => b.product.toString() === product._id.toString())
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.createdAt || null,
      };

      if (bookingCount >= 5) {
        fsnAnalysis.fast.push(productData);
      } else if (bookingCount > 0) {
        fsnAnalysis.slow.push(productData);
      } else {
        fsnAnalysis.nonMoving.push(productData);
      }
    });

    // Sort each category by booking count (descending)
    fsnAnalysis.fast.sort((a, b) => b.bookingCount - a.bookingCount);
    fsnAnalysis.slow.sort((a, b) => b.bookingCount - a.bookingCount);
    fsnAnalysis.nonMoving.sort((a, b) => new Date(b.lastBooked || 0) - new Date(a.lastBooked || 0));

    res.json(fsnAnalysis);
  } catch (error) {
    console.error('Error in getFSNAnalysis:', error);
    res.status(500).json({ message: error.message });
  }
});

export {
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  getFSNAnalysis,
};
