import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ p }) => {
  // Check if the image URL is already a full URL (from Cloudinary)
  const imageUrl =
    p.image && p.image.startsWith('http')
      ? p.image
      : `${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${p.image}`;

  return (
    <div className="max-w-sm h-[550px] relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full"
            src={imageUrl}
            alt={p.name}
            style={{ height: '300px', objectFit: 'fill' }}
          />
        </Link>
      </section>

      <div className="p-4 flex flex-col flex-grow">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">{p.name}</h3>
          <p className="text-sm text-gray-300">{p.description.substring(0, 90)}...</p>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-primary">Rent: ${p.price}/week</span>
            {p.salePrice && (
              <span className="text-lg font-bold text-green-500">Buy: ${p.salePrice}</span>
            )}
          </div>
          <span className="text-sm text-gray-500">Stock: {p.countInStock}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${i < p.rating ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`}
              />
            ))}
            <span className="text-sm text-gray-400">({p.numReviews})</span>
          </div>
          <Link
            to={`/product/${p._id}`}
            className="text-primary hover:text-primary-dark text-sm font-medium rounded-lg bg-pink-500 text-white px-4 py-2 hover:bg-pink-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
