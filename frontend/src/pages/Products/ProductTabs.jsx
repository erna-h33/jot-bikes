import { useState } from 'react';
import { Link } from 'react-router-dom';
import Ratings from './Ratings';
import { useGetTopProductsQuery } from '../../redux/api/productApiSlice';
import SmallProduct from './SmallProduct';
import Loader from '../../components/Loader';
import { FaStar, FaComment, FaShoppingBag } from 'react-icons/fa';

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 1
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => handleTabClick(1)}
        >
          <FaComment className="mr-2" />
          Write Review
        </button>
        <button
          className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 2
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => handleTabClick(2)}
        >
          <FaStar className="mr-2" />
          All Reviews
        </button>
        <button
          className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 3
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => handleTabClick(3)}
        >
          <FaShoppingBag className="mr-2" />
          Related Products
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="max-w-2xl">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select Rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  {loadingProductReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">Please sign in to write a review</p>
                <Link
                  to="/login"
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{review.name}</p>
                        <p className="text-sm text-gray-400">{review.createdAt.substring(0, 10)}</p>
                      </div>
                    </div>
                    <Ratings value={review.rating} />
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div>
            {!data ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((product) => (
                  <div key={product._id} className="transform transition-transform hover:scale-105">
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
