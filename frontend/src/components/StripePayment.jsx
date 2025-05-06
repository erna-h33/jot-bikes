import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearCartItems } from '../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Remove debug logging
if (!stripeKey) {
  console.error('Stripe publishable key is not defined in environment variables');
}

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ totalPrice, bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Send payment info to your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: totalPrice,
          currency: 'usd',
          bookingId: bookingId,
          cartItems: cartItems,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment successful!');
        dispatch(clearCartItems());
        navigate('/order-success');
      } else {
        setError(result.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {!stripeKey ? (
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">
          Payment system is currently unavailable. Please try again later.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="card-element">
              Credit or debit card
            </label>
            <div className="p-3 border border-gray-600 rounded-md bg-gray-700">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      color: '#ffffff',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      fontSmoothing: 'antialiased',
                      fontSize: '16px',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#fa755a',
                      iconColor: '#fa755a',
                    },
                  },
                }}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay $${Number(totalPrice).toFixed(2)}`}
          </button>
        </>
      )}
    </form>
  );
};

const StripePayment = ({ totalPrice, bookingId }) => {
  if (!stripeKey) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-md">
        Payment system is currently unavailable. Please try again later.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalPrice={totalPrice} bookingId={bookingId} />
    </Elements>
  );
};

export default StripePayment;
