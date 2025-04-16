import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
        <div className="mb-6">
          <FaCheckCircle className="mx-auto text-6xl text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your order has been successfully processed.
        </p>
        <div className="space-y-4">
          <Link
            to="/my-bookings"
            className="block w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
