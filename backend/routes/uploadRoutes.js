import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage (temporary storage before uploading to Cloudinary)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Route to handle file uploads
router.post('/', upload.single('image'), async (req, res) => {
  console.log('Upload request received');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }

  if (!req.file) {
    console.log('No file in request');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Log Cloudinary configuration (without sensitive data)
    console.log('Cloudinary configuration:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing',
    });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    console.log('Attempting to upload to Cloudinary...');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'jot-bikes',
      resource_type: 'auto',
    });

    console.log('File uploaded to Cloudinary successfully:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
    });

    // Return the Cloudinary URL
    res.json({ image: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      name: error.name,
    });
    res.status(500).json({
      error: 'Error uploading file to Cloudinary',
      details: error.message,
    });
  }
});

// Route to check all product images
router.get('/check-product-images', async (req, res) => {
  try {
    // Import your Product model correctly
    const Product = (await import('../models/productModel.js')).default;

    // Get all products with their images
    const products = await Product.find({}, 'name image');

    // Count products with images
    const productsWithImages = products.filter((product) => product.image);

    res.json({
      totalProducts: products.length,
      productsWithImages: productsWithImages.length,
      products: products.map((product) => ({
        name: product.name,
        image: product.image,
      })),
    });
  } catch (error) {
    console.error('Error checking product images:', error);
    res.status(500).json({ error: 'Error checking product images' });
  }
});

export default router;
