import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

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
  const products = await Product.find({ vendor: req.user._id }).populate('category');
  res.json(products);
});

// @desc    Create vendor product
// @route   POST /api/vendor/products
// @access  Private/Vendor
const createVendorProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, price, category, countInStock, size, color, salePrice } =
      req.fields;

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
      price: Number(price).toFixed(2),
      salePrice: salePrice ? Number(salePrice).toFixed(2) : null,
      description,
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      vendor: req.user._id,
      size,
      color,
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
    const { name, description, brand, price, category, countInStock, size, color, salePrice } =
      req.fields;

    // Find the product
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the product belongs to the vendor
      if (product.vendor.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this product');
      }

      // Handle image upload if a new image is provided
      if (req.files && req.files.image) {
        const file = req.files.image;

        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'jot-bikes',
            resource_type: 'auto',
          });

          // Use the Cloudinary URL
          product.image = result.secure_url;
          console.log('Image uploaded to Cloudinary:', product.image);

          // Clean up the temporary file
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }
      }

      product.name = name;
      product.price = Number(price).toFixed(2);
      product.salePrice = salePrice ? Number(salePrice).toFixed(2) : null;
      product.description = description;
      product.brand = brand;
      product.category = category;
      product.countInStock = Number(countInStock);
      if (size) product.size = size;
      if (color) product.color = color;

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
