import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Ratings = ({ value, text, color = 'yellow-500' }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={`text-${color} text-lg`} />
        ))}

        {halfStars === 1 && <FaStarHalfAlt className={`text-${color} text-lg`} />}

        {[...Array(emptyStar)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className={`text-${color} text-lg`} />
        ))}
      </div>

      {text && <span className={`ml-2 text-sm text-gray-300`}>{text}</span>}
    </div>
  );
};

export default Ratings;
