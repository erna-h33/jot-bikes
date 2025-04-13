import { Link } from 'react-router-dom';
import Ratings from './Ratings';

const SmallProduct = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition duration-300"
        />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h2>
            <p className="text-gray-600 text-sm line-clamp-1">{product.description}</p>
            <div className="mt-1">
              <Ratings value={product.rating} text={`(${product.numReviews})`} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-pink-600">${product.price}</span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">View</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
