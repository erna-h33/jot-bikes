import React, { useState } from 'react';
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../redux/api/bookingApiSlice';
import AdminMenu from './AdminMenu';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import moment from 'moment';
import { toast } from 'react-toastify';

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: bookings, isLoading, error, refetch } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateStatus({ bookingId, status: newStatus }).unwrap();
      toast.success('Booking status updated successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const filteredBookings = bookings?.filter((booking) =>
    statusFilter === 'all' ? true : booking.status === statusFilter
  );

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 p-6 ml-[250px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Bookings</h1>
          <div className="mt-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 p-2.5"
            >
              <option value="all">All Bookings</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Booking ID</th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Start Date</th>
                    <th className="py-3 px-4 text-left">End Date</th>
                    <th className="py-3 px-4 text-left">Total Price</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings?.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{booking._id}</td>
                      <td className="py-3 px-4 text-sm">{booking.user.username}</td>
                      <td className="py-3 px-4 text-sm">{booking.product.name}</td>
                      <td className="py-3 px-4 text-sm">
                        {moment(booking.startDate).format('YYYY-MM-DD')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {moment(booking.endDate).format('YYYY-MM-DD')}
                      </td>
                      <td className="py-3 px-4 text-sm">${booking.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
