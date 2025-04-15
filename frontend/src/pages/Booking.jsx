import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../redux/api/productApiSlice';
import { addToCart } from '../redux/features/cart/cartSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [weeks, setWeeks] = useState(1);

  const { data: product, isLoading } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);

  // Calculate weeks whenever dates change
  useEffect(() => {
    const diffTime = Math.abs(endDate - startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    setWeeks(diffWeeks);
  }, [startDate, endDate]);

  const calculatePrice = () => {
    if (!product) return 0;
    return (product.price * weeks).toFixed(2);
  };

  const handleBooking = () => {
    if (!userInfo) {
      navigate('/login?redirect=/booking/' + productId);
      return;
    }

    const bookingItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: calculatePrice(),
      startDate,
      endDate,
      weeks,
      qty: 1,
    };

    dispatch(addToCart(bookingItem));
    navigate('/cart');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white pt-40">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10">
      <div className="container mx-auto px-4">
        <Link
          to={`/product/${productId}`}
          className="inline-flex items-center text-white hover:text-pink-400 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Product
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Book Your Ride</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
                <img
                  src={`${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
                    product.image
                  }`}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-300">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Select Rental Period</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-300">Weekly Rate</span>
                  <span className="font-semibold">${product.price}/week</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-300">Duration</span>
                  <span className="font-semibold">
                    {weeks} {weeks === 1 ? 'week' : 'weeks'}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-pink-500">${calculatePrice()}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-pink-700 transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
