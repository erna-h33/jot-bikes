import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../../redux/api/productApiSlice';
import { useGetProductBookingsQuery } from '../../redux/api/bookingApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaBox, FaClock, FaStar, FaStore, FaArrowLeft, FaUser } from 'react-icons/fa';
import moment from 'moment';
import Ratings from './Ratings';
import ProductTabs from './ProductTabs';
import { useCreateBookingMutation } from '../../redux/api/bookingApiSlice';
import { addToCart } from '../../redux/features/cart/cartSlice';
import AvailabilityCalendar from '../../components/AvailabilityCalendar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isPurchase, setIsPurchase] = useState(false);

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

  const { data: productBookings } = useGetProductBookingsQuery(productId);

  // Calculate total days and price
  const bookingDetails = useMemo(() => {
    if (!startDate || !endDate || !product) return null;

    const start = moment(startDate);
    const end = moment(endDate);
    const days = end.diff(start, 'days') + 1; // Include both start and end days

    // Calculate full weeks and remaining days
    const fullWeeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    // Calculate prices
    const pricePerDay = (product.price || 0) / 7; // Daily rate is weekly price divided by 7
    const pricePerWeek = product.price || 0;

    // Calculate subtotal: (full weeks × weekly price) + (remaining days × daily price)
    const weeklySubtotal = fullWeeks * pricePerWeek;
    const dailySubtotal = remainingDays * pricePerDay;
    const subtotal = (weeklySubtotal + dailySubtotal) * qty;

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return {
      days,
      fullWeeks,
      remainingDays,
      pricePerDay,
      pricePerWeek,
      weeklySubtotal,
      dailySubtotal,
      subtotal,
      tax,
      total,
    };
  }, [startDate, endDate, qty, product?.price]);

  const checkAvailability = (start, end, quantity) => {
    if (!productBookings) return true;

    const startDate = moment(start);
    const endDate = moment(end);

    // Create a map of dates and their bookings
    const dateBookings = {};
    productBookings.forEach((booking) => {
      const bookingStart = moment(booking.startDate);
      const bookingEnd = moment(booking.endDate);
      let current = moment(bookingStart);

      while (current.isSameOrBefore(bookingEnd, 'day')) {
        const dateKey = current.format('YYYY-MM-DD');
        dateBookings[dateKey] = (dateBookings[dateKey] || 0) + 1;
        current.add(1, 'day');
      }
    });

    // Check if requested quantity is available for all dates
    let current = moment(startDate);
    while (current.isSameOrBefore(endDate, 'day')) {
      const dateKey = current.format('YYYY-MM-DD');
      const bookedUnits = dateBookings[dateKey] || 0;
      if (product.countInStock - bookedUnits < quantity) {
        return false;
      }
      current.add(1, 'day');
    }

    return true;
  };

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

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please log in to book.');
      navigate('/login');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date.');
      return;
    }

    // Check availability before booking
    if (!checkAvailability(startDate, endDate, qty)) {
      toast.error('Selected quantity not available for these dates.');
      return;
    }

    try {
      const booking = await createBooking({
        product: product._id,
        startDate,
        endDate,
        quantity: qty,
        size: selectedSize,
        color: selectedColor,
      }).unwrap();

      toast.success('Booking successful!');
      const cartItem = {
        _id: product._id,
        name: product.name,
        image: product.image,
        price: bookingDetails.total,
        countInStock: product.countInStock,
        qty: qty,
        bookingId: booking._id,
        startDate,
        endDate,
        size: selectedSize,
        color: selectedColor,
      };
      dispatch(addToCart(cartItem));
      setStartDate('');
      setEndDate('');
      setSelectedSize('');
      setSelectedColor('');
      navigate('/cart');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handlePurchase = async (product) => {
    try {
      setIsPurchase(true);
      // Add to cart with purchase flag and ensure vendor is included
      const cartItem = {
        ...product,
        isPurchase: true,
        vendor: product.vendor._id || product.vendor, // Handle both populated and unpopulated vendor
      };
      dispatch(addToCart(cartItem));
      navigate('/cart');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsPurchase(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.isPurchase) {
      return acc + Number(item.salePrice);
    }
    return acc + item.qty * item.price;
  }, 0);

  const tax = cartItems.reduce((acc, item) => {
    if (item.isPurchase) {
      return acc + Number(item.salePrice) * 0.15;
    }
    return acc + item.qty * item.price * 0.15;
  }, 0);

  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 text-white">
      <PageHero title="Product Details" backgroundImage="/images/productDetailsHero.webp" />
      <div className="container mx-auto px-4 my-10">
        <Link
          to="/shop"
          className="inline-flex items-center text-gray-900 hover:text-pink-400 transition-colors mb-10"
        >
          <FaArrowLeft className="mr-2 text-gray-900" /> Go to Shop
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Details */}
              <div className="space-y-6">
                {/* Product Image */}
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      product.image && product.image.startsWith('http')
                        ? product.image
                        : `${
                            import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                          }${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-[500px] object-fit"
                  />
                </div>

                {/* Product Info */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

                  <div className="flex items-center space-x-2 mb-4">
                    <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                  </div>

                  <div className="flex flex-col space-y-4 mb-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-pink-500">Rental Option</h3>
                          <p className="text-gray-300">Weekly rate</p>
                        </div>
                        <span className="text-3xl font-bold text-pink-500">${product.price}</span>
                      </div>
                    </div>

                    {product.salePrice && (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-green-500">
                              Purchase Option
                            </h3>
                            <p className="text-gray-300">One-time payment</p>
                          </div>
                          <span className="text-3xl font-bold text-green-500">
                            ${product.salePrice}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 text-lg mb-6">{product.description}</p>

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
                    {product.size && (
                      <div className="flex items-center">
                        <FaBox className="mr-2 text-pink-500" />
                        <span className="text-gray-300">Size: {product.size}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex items-center">
                        <FaBox className="mr-2 text-pink-500" />
                        <span className="text-gray-300">Color: {product.color}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Section */}
              <div className="space-y-6">
                {/* Book this Bike Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-4">Choose Your Option</h2>

                  {/* Purchase Option */}
                  {product.salePrice && (
                    <div className="mb-6 p-4 border border-green-500 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-500 mb-2">Purchase</h3>
                      <p className="text-gray-300 mb-4">Buy this bike for ${product.salePrice}</p>
                      <button
                        onClick={() => handlePurchase(product)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Buy Now
                      </button>
                    </div>
                  )}

                  {/* Rental Option */}
                  <div className="p-4 border border-pink-500 rounded-lg">
                    <h3 className="text-xl font-semibold text-pink-500 mb-2">Rental</h3>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex flex-col mb-2 md:mb-0 flex-1">
                          <label htmlFor="startDate" className="text-gray-300 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            min={moment().format('YYYY-MM-DD')}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label htmlFor="endDate" className="text-gray-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            min={startDate || moment().format('YYYY-MM-DD')}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      {product.countInStock > 0 && (
                        <div className="flex items-center space-x-4">
                          <div>
                            <label htmlFor="qty" className="text-gray-300 mr-2">
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

                          {product.size && (
                            <div>
                              <label htmlFor="size" className="text-gray-300 mr-2">
                                Size:
                              </label>
                              <select
                                id="size"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                              >
                                <option value="">Select Size</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                              </select>
                            </div>
                          )}

                          {product.color && (
                            <div>
                              <label htmlFor="color" className="text-gray-300 mr-2">
                                Color:
                              </label>
                              <select
                                id="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                              >
                                <option value="">Select Color</option>
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Red">Red</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price Breakdown */}
                      {bookingDetails && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg space-y-2">
                          <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
                          <div className="flex justify-between text-gray-300">
                            <span>Duration:</span>
                            <span>
                              {bookingDetails.fullWeeks > 0 &&
                                `${bookingDetails.fullWeeks} week${
                                  bookingDetails.fullWeeks > 1 ? 's' : ''
                                }`}
                              {bookingDetails.remainingDays > 0 &&
                                ` ${bookingDetails.remainingDays} day${
                                  bookingDetails.remainingDays > 1 ? 's' : ''
                                }`}
                              {` (${bookingDetails.days} days total)`}
                            </span>
                          </div>
                          {bookingDetails.fullWeeks > 0 && (
                            <div className="flex justify-between text-gray-300">
                              <span>Weekly rate:</span>
                              <span>
                                ${bookingDetails.pricePerWeek.toFixed(2)} ×{' '}
                                {bookingDetails.fullWeeks} week
                                {bookingDetails.fullWeeks > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          {bookingDetails.remainingDays > 0 && (
                            <div className="flex justify-between text-gray-300">
                              <span>Daily rate:</span>
                              <span>
                                ${bookingDetails.pricePerDay.toFixed(2)} ×{' '}
                                {bookingDetails.remainingDays} day
                                {bookingDetails.remainingDays > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-300">
                            <span>Quantity:</span>
                            <span>× {qty}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Subtotal:</span>
                            <span>${bookingDetails.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Tax (10%):</span>
                            <span>${bookingDetails.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-700">
                            <span>Total:</span>
                            <span className="text-pink-500">
                              ${bookingDetails.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        disabled={bookingLoading || !bookingDetails}
                      >
                        {bookingLoading
                          ? 'Booking...'
                          : bookingDetails
                          ? `Book Now - $${Number(bookingDetails.total).toFixed(2)}`
                          : 'Select dates to see price'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Reviews Section - Moved here */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
