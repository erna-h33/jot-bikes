import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ p }) => {
  return (
    <div className="max-w-sm h-[550px] relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full"
            src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
              p.image
            }`}
            alt={p.name}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </Link>
      </section>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">{p.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{p.description.substring(0, 180)}...</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">${p.price}</span>
          <span className="text-sm text-gray-500">Stock: {p.countInStock}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${i < p.rating ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({p.numReviews})</span>
          </div>
          <Link
            to={`/product/${p._id}`}
            className="text-primary hover:text-primary-dark text-sm font-medium rounded-lg bg-pink-500 text-white px-4 pt-2 pb-2.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
