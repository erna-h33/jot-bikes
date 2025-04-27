import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/productModel.js';
import fs from 'fs';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to upload a local file to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return null;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'jot-bikes',
      resource_type: 'auto',
    });

    console.log(`Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    return null;
  }
};

// Main migration function
const migrateToCloudinary = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Process each product
    for (const product of products) {
      console.log(`Processing product: ${product.name}`);

      // Skip if image is already a Cloudinary URL
      if (product.image && product.image.includes('cloudinary.com')) {
        console.log(`Product ${product.name} already has a Cloudinary image`);
        continue;
      }

      // Extract filename from image path
      const imagePath = product.image;
      if (!imagePath) {
        console.log(`Product ${product.name} has no image path`);
        continue;
      }

      // Get the filename from the path
      const filename = imagePath.split('/').pop();
      if (!filename) {
        console.log(`Could not extract filename from ${imagePath}`);
        continue;
      }

      // Construct the full path to the file
      const fullPath = path.join(__dirname, '../../uploads', filename);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(fullPath);

      if (cloudinaryUrl) {
        // Update product with Cloudinary URL
        product.image = cloudinaryUrl;
        await product.save();
        console.log(`Updated product ${product.name} with Cloudinary URL`);
      } else {
        console.log(`Failed to upload image for product ${product.name}`);
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error(`Migration error: ${error.message}`);
    process.exit(1);
  }
};

// Run the migration
migrateToCloudinary();
