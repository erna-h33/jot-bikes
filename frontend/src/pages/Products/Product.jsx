import { Link } from 'react-router-dom';
import Ratings from './Ratings';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
            product.image
          }`}
          alt={product.name}
          className="w-full h-64 object-cover hover:opacity-90 transition duration-300"
        />
      </div>

      <div className="p-6">
        <Link to={`/product/${product._id}`}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            <div className="mt-2">
              <Ratings value={product.rating} text={`(${product.numReviews} reviews)`} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-pink-600">${product.price}</span>
            <span className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
              View Details
            </span>
          </div>
        </Link>

        <div className="mt-4">
          <Link
            to={`/product/${product._id}`}
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium transition duration-300 ${
              product.countInStock > 0
                ? 'bg-pink-600 hover:bg-pink-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {product.countInStock > 0 ? 'Book Now' : 'Out of Stock'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
