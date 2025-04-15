import { useGetMyBookingsQuery, useDeleteBookingMutation } from '../redux/api/bookingApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import moment from 'moment';

const MyBookings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: bookings, isLoading, error, refetch } = useGetMyBookingsQuery();
  const [deleteBooking, { isLoading: deleting }] = useDeleteBookingMutation();

  if (!userInfo) {
    navigate('/login?redirect=/my-bookings');
    return null;
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await deleteBooking(id).unwrap();
      toast.success('Booking cancelled');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-40 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : bookings && bookings.length === 0 ? (
          <Message>No bookings found.</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Start Date</th>
                  <th className="py-2 px-4">End Date</th>
                  <th className="py-2 px-4">Total Price</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-700">
                    <td className="py-2 px-4">
                      {booking.product ? (
                        <div>
                          <div className="font-semibold">{booking.product.name}</div>
                          <div className="text-gray-400 text-sm">{booking.product.brand}</div>
                        </div>
                      ) : (
                        'Product deleted'
                      )}
                    </td>
                    <td className="py-2 px-4">{moment(booking.startDate).format('YYYY-MM-DD')}</td>
                    <td className="py-2 px-4">{moment(booking.endDate).format('YYYY-MM-DD')}</td>
                    <td className="py-2 px-4">${booking.totalPrice}</td>
                    <td className="py-2 px-4 capitalize">{booking.status}</td>
                    <td className="py-2 px-4">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-1 px-4 rounded-lg transition-colors"
                          disabled={deleting}
                        >
                          {deleting ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
