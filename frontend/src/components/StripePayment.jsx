import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearCartItems } from '../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: totalPrice,
          currency: 'usd',
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
        {loading ? 'Processing...' : `Pay $${totalPrice}`}
      </button>
    </form>
  );
};

const StripePayment = ({ totalPrice }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalPrice={totalPrice} />
    </Elements>
  );
};

export default StripePayment;
