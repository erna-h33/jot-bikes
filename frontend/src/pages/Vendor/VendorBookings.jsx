import React, { useState } from 'react';
import {
  useGetVendorBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../redux/api/bookingApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import VendorMenu from './VendorMenu';

const VendorBookings = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: bookings, isLoading, error, refetch } = useGetVendorBookingsQuery();
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
      <VendorMenu />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FaCalendarAlt className="text-pink-600 text-2xl mr-2" />
              <h1 className="text-2xl font-semibold text-gray-800">My Product Bookings</h1>
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
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
          ) : filteredBookings?.length === 0 ? (
            <Message>No bookings found.</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings?.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.product.name}
                            </div>
                            <div className="text-sm text-gray-500">{booking.product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.user.username}</div>
                        <div className="text-sm text-gray-500">{booking.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {moment(booking.startDate).format('MMM D, YYYY')} -
                          <br />
                          {moment(booking.endDate).format('MMM D, YYYY')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-pink-600">
                          ${booking.totalPrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancelled')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorBookings;
