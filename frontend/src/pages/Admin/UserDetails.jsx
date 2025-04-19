import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/actions/userActions';
import { format } from 'date-fns';
import AdminMenu from './AdminMenu';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userDetails, loading, error } = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex">
        <AdminMenu />
        <div className="flex-1 ml-[250px] p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <AdminMenu />
        <div className="flex-1 ml-[250px] p-8">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex">
        <AdminMenu />
        <div className="flex-1 ml-[250px] p-8">
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">User not found</span>
          </div>
        </div>
      </div>
    );
  }

  const { user, bookings, totalSpent, rentalHistory } = userDetails;

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 ml-[250px] p-8">
        <div className="my-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <button
              onClick={() => navigate('/admin/userlist')}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              Back to Users
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">Name</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{user.username}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">Email</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{user.email}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">Role</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin
                              ? 'bg-red-100 text-red-800'
                              : user.isVendor
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.isAdmin ? 'Admin' : user.isVendor ? 'Vendor' : 'Customer'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">Joined</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {format(new Date(user.createdAt), 'PPP')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rental Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rental Statistics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">
                        Total Bookings
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {rentalHistory.total || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">Total Spent</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        ${(totalSpent || 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">
                        Active Rentals
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {rentalHistory.confirmed || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">
                        Completed Rentals
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {rentalHistory.completed || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Rental History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rental History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings?.map((booking) => (
                    <tr key={booking._id}>
                      <td className="py-3 px-4 text-sm text-gray-900">{booking.product?.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {format(new Date(booking.startDate), 'PPP')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {format(new Date(booking.endDate), 'PPP')}
                      </td>
                      <td className="py-3 px-4 text-sm">
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
                      <td className="py-3 px-4 text-sm text-gray-900">
                        ${booking.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={() => navigate(`/admin/rental-agreements/${booking._id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          View Rental Agreement
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
