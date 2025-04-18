import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/features/cart/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10 -mt-20">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center text-white hover:text-pink-400 transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-xl mb-4">Your cart is empty</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-700 transition duration-300"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                        }${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-xl font-semibold text-pink-500 hover:text-pink-400"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-400">{item.brand}</p>
                      <p className="text-2xl font-bold text-pink-500 mt-2">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="w-24">
                      <select
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="text-red-500 hover:text-red-400 transition duration-300 p-2"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items</span>
                  <span className="font-semibold">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">
                    $
                    {Number(
                      cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-semibold">
                    $
                    {Number(
                      cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-pink-500">
                      $
                      {Number(
                        cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) +
                          cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) * 0.15
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-pink-600 text-white py-3 px-6 pb-4 rounded-full mt-6 text-lg font-semibold hover:bg-pink-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
