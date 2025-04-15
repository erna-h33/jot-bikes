import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../../redux/api/productApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaUser,
} from 'react-icons/fa';
import moment from 'moment';
import Ratings from './Ratings';
import ProductTabs from './ProductTabs';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: qty,
    };
    dispatch(addToCart(cartItem));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10 -mt-20">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center text-white hover:text-pink-400 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Go to Shop
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Product Image */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
                    product.image
                  }`}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col space-y-6">
                <h1 className="text-3xl font-bold text-white">{product.name}</h1>

                <div className="flex items-center space-x-2">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                </div>

                <p className="text-4xl font-extrabold text-pink-500">${product.price}</p>

                <p className="text-gray-300 text-lg">{product.description}</p>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-700">
                  <div className="flex items-center">
                    <FaStore className="mr-2 text-pink-500" />
                    <span className="text-gray-300">Brand: {product.brand}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-pink-500" />
                    <span className="text-gray-300">
                      Added: {moment(product.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="mr-2 text-pink-500" />
                    <span className="text-gray-300">Reviews: {product.numReviews}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBox className="mr-2 text-pink-500" />
                    <span className="text-gray-300">In Stock: {product.countInStock}</span>
                  </div>
                  {product.vendor && (
                    <div className="flex items-center col-span-2">
                      <FaUser className="mr-2 text-pink-500" />
                      <span className="text-gray-300">
                        Vendor: {product.vendor.vendorName || product.vendor.name}
                      </span>
                    </div>
                  )}
                </div>

                {product.countInStock > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <label htmlFor="qty" className="mr-2 text-gray-300">
                        Quantity:
                      </label>
                      <select
                        id="qty"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add To Cart
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
