import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import StripePayment from '../components/StripePayment';

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, itemsPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10">
      <div className="container mx-auto px-4">
        <Link
          to="/cart"
          className="inline-flex items-center text-white hover:text-pink-400 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                    }${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-400">
                      {item.weeks} {item.weeks === 1 ? 'week' : 'weeks'} rental
                    </p>
                    <p className="text-pink-500 font-semibold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Payment</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-semibold">${itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="font-semibold">${taxPrice}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-pink-500">${totalPrice}</span>
                </div>
              </div>

              <div className="mt-6">
                <StripePayment totalPrice={totalPrice} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
