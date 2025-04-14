import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { FaShoppingCart } from 'react-icons/fa';
import Ratings from './Ratings';

const SmallProduct = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
    };
    dispatch(addToCart(cartItem));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
            product.image
          }`}
          alt={product.name}
          className="w-full h-64 object-cover hover:opacity-90 transition duration-300"
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
            <span className="text-xl font-bold text-pink-600">${product.price}</span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">View</span>
          </div>
        </Link>

        <div className="mt-4">
          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium transition duration-300 ${
              product.countInStock > 0
                ? 'bg-pink-600 hover:bg-pink-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart className="mr-2" />
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
