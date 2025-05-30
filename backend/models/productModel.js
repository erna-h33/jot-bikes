import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, default: 'No description' },
    brand: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      default: 0,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
    salePrice: {
      type: Number,
      required: false,
      default: null,
      get: (v) => (v ? Math.round(v) : null),
      set: (v) => (v ? Math.round(v) : null),
    },
    category: { type: ObjectId, ref: 'Category', required: true },
    countInStock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    vendor: { type: ObjectId, ref: 'User', required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: 0, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    size: { type: String, required: false },
    color: { type: String, required: false },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
