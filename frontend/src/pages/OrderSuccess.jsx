import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-400 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <FaHome className="mr-2" /> Return Home
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaShoppingBag className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
