import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import Ratings from './Ratings';

const SmallProduct = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={
            product.image && product.image.startsWith('http')
              ? product.image
              : `${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
                  product.image
                }`
          }
          alt={product.name}
          className="w-full h-64 object-contain hover:opacity-90 transition duration-300"
        />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            <div className="mt-1">
              <Ratings value={product.rating} text={`(${product.numReviews})`} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              {product.salePrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-pink-600">
                    Buy: ${product.salePrice}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-800">
                  Rent: ${product.price}/week
                </span>
              </div>
            </div>
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
            <FaShoppingCart className="mr-2" />
            {product.countInStock > 0 ? 'View Product' : 'Out of Stock'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
