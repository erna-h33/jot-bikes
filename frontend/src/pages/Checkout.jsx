import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import StripePayment from '../components/StripePayment';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.isPurchase) {
      return acc + Number(item.salePrice || 0);
    }
    return acc + Number(item.qty || 1) * Number(item.price || 0);
  }, 0);

  const tax = cartItems.reduce((acc, item) => {
    if (item.isPurchase) {
      return acc + Number(item.salePrice || 0) * 0.15;
    }
    return acc + Number(item.qty || 1) * Number(item.price || 0) * 0.15;
  }, 0);

  const total = subtotal + tax;

  // Get the booking ID from the cart item
  const bookingId = cartItems[0]?.bookingId;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 -mt-20 pb-10">
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
                    src={
                      item.image && item.image.startsWith('http')
                        ? item.image
                        : `${
                            import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                          }${item.image}`
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {item.isPurchase ? (
                      <p className="text-gray-400">Purchase</p>
                    ) : (
                      <p className="text-gray-400">
                        {item.weeks} {item.weeks === 1 ? 'week' : 'weeks'} rental
                      </p>
                    )}
                    <p
                      className={`font-semibold ${
                        item.isPurchase ? 'text-green-500' : 'text-pink-500'
                      }`}
                    >
                      $
                      {item.isPurchase
                        ? Number(item.salePrice || 0).toFixed(2)
                        : Number(item.price || 0).toFixed(2)}
                    </p>
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
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-pink-500">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <StripePayment totalPrice={total} bookingId={bookingId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
