import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get vendor profile
// @route   GET /api/vendor/profile
// @access  Private/Vendor
const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.user._id).select('-password');
  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Update vendor profile
// @route   PUT /api/vendor/profile
// @access  Private/Vendor
const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await User.findById(req.user._id);

  if (vendor) {
    vendor.name = req.body.name || vendor.name;
    vendor.email = req.body.email || vendor.email;
    vendor.vendorName = req.body.vendorName || vendor.vendorName;
    if (req.body.password) {
      vendor.password = req.body.password;
    }

    const updatedVendor = await vendor.save();

    res.json({
      _id: updatedVendor._id,
      name: updatedVendor.name,
      email: updatedVendor.email,
      isVendor: updatedVendor.isVendor,
      vendorName: updatedVendor.vendorName,
      vendorId: updatedVendor.vendorId,
    });
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});

// @desc    Get vendor products
// @route   GET /api/vendor/products
// @access  Private/Vendor
const getVendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id });
  res.json(products);
});

// @desc    Create vendor product
// @route   POST /api/vendor/products
// @access  Private/Vendor
const createVendorProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, price, category, countInStock } = req.fields;

    // Validate required fields
    if (!name || !description || !brand || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Set default image path
    let image = '/uploads/default.jpg';

    // If an image was uploaded
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename = `upload_${Date.now()}_${file.originalFilename || file.name}`;
      const targetPath = path.join(__dirname, '../../uploads', filename);

      try {
        // Move the file to the uploads directory
        if (fs.existsSync(file.path)) {
          fs.renameSync(file.path, targetPath);
          image = `/uploads/${filename}`;
          console.log('Image saved successfully at:', targetPath);
        } else {
          console.error('Source file does not exist:', file.path);
          return res.status(500).json({ error: 'Image upload failed - source file not found' });
        }
      } catch (fileError) {
        console.error('Error handling file:', fileError);
        // Clean up temporary file if it exists
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (cleanupError) {
            console.error('Error cleaning up temporary file:', cleanupError);
          }
        }
        return res.status(500).json({ error: 'Failed to process image upload' });
      }
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      vendor: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error in createVendorProduct:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update vendor product
// @route   PUT /api/vendor/products/:id
// @access  Private/Vendor
const updateVendorProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.vendor.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized as vendor');
      }

      const { name, description, brand, price, category, countInStock } = req.fields;

      // Validate required fields
      if (!name || !description || !brand || !price || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Handle image upload if a new image is provided
      if (req.files && req.files.image) {
        const file = req.files.image;
        const filename = `upload_${Date.now()}_${file.originalFilename || file.name}`;
        const targetPath = path.join(__dirname, '../../uploads', filename);

        try {
          // Move the file to the uploads directory
          if (fs.existsSync(file.path)) {
            fs.renameSync(file.path, targetPath);
            product.image = `/uploads/${filename}`;
            console.log('Image saved successfully at:', targetPath);
          } else {
            console.error('Source file does not exist:', file.path);
            return res.status(500).json({ error: 'Image upload failed - source file not found' });
          }
        } catch (fileError) {
          console.error('Error handling file:', fileError);
          // Clean up temporary file if it exists
          if (fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (cleanupError) {
              console.error('Error cleaning up temporary file:', cleanupError);
            }
          }
          return res.status(500).json({ error: 'Failed to process image upload' });
        }
      }

      product.name = name;
      product.price = Number(price);
      product.description = description;
      product.brand = brand;
      product.category = category;
      product.countInStock = Number(countInStock);

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error in updateVendorProduct:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete vendor product
// @route   DELETE /api/vendor/products/:id
// @access  Private/Vendor
const deleteVendorProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.vendor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized as vendor');
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

export {
  getVendorProfile,
  updateVendorProfile,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
};
