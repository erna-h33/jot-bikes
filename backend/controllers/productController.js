import asyncHandler from '../middlewares/asyncHandler.js';
import Product from '../models/productModel.js';

export const addProduct = async (req, res) => {
  try {
    console.log('Received request fields:', req.fields);
    console.log('Received request files:', req.files);
    console.log('Received request file (multer):', req.file);
    console.log('User in request:', req.user);

    const { name, description, brand, price, quantity, category, countInStock } =
      req.fields || req.body;

    // Validate required fields
    if (!name || !description || !brand || !price || !quantity || !category) {
      console.log('Missing required fields:', {
        name: !name,
        description: !description,
        brand: !brand,
        price: !price,
        quantity: !quantity,
        category: !category,
      });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Set default image path
    let image = '/uploads/default.jpg';

    // If an image was uploaded via formidable
    if (req.files && req.files.image) {
      const file = req.files.image;
      // Get the filename from the file object
      const filename = file.originalFilename || file.name;
      image = `/uploads/${filename}`;
      console.log('Image path (formidable):', image);
    }
    // If an image was uploaded via multer
    else if (req.file) {
      image = `/uploads/${req.file.filename}`;
      console.log('Image path (multer):', image);
    }

    const productData = {
      name,
      description,
      brand,
      price: Number(price),
      quantity: Number(quantity),
      category,
      countInStock: Number(countInStock || 0),
      image,
      user: req.user._id,
    };

    console.log('Creating product with data:', productData);

    try {
      const product = await Product.create(productData);
      console.log('Product created successfully:', product);
      res.status(201).json(product);
    } catch (dbError) {
      console.error('Database error creating product:', dbError);
      res.status(400).json({ message: dbError.message });
    }
  } catch (error) {
    console.error('Error in addProduct controller:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, brand, price, quantity, category } = req.fields || req.body;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: 'Name is required' });
      case !description:
        return res.json({ error: 'Description is required' });
      case !brand:
        return res.json({ error: 'Brand is required' });
      case !price:
        return res.json({ error: 'Price is required' });
      case !quantity:
        return res.json({ error: 'Quantity is required' });
      case !category:
        return res.json({ error: 'Category is required' });
    }

    // Check for image upload
    let updateData = { ...req.fields };

    // If an image was uploaded via formidable
    if (req.files && req.files.image) {
      const file = req.files.image;
      const filename = file.originalFilename || file.name;
      updateData.image = `/uploads/${filename}`;
      console.log('Update image path (formidable):', updateData.image);
    }
    // If an image was uploaded via multer
    else if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      console.log('Update image path (multer):', updateData.image);
    }

    // Update product
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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
    const products = await Product.find({ ...keyword }).limit(pageSize);

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
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Product not found' });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate('category').limit(12).sort({ createAt: -1 });
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
        name: req.user.name,
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
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
};
