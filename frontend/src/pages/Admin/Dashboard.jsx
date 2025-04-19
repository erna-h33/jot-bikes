import React from 'react';
import { useSelector } from 'react-redux';
import AdminMenu from './AdminMenu';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';
import { useGetAllBookingsQuery, useGetStockStatusQuery } from '../../redux/api/bookingApiSlice';
import {
  FaUsers,
  FaBox,
  FaCalendarCheck,
  FaDollarSign,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import moment from 'moment';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: products, isLoading: productsLoading } = useAllProductsQuery();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookingsQuery();
  const { data: stockStatus, isLoading: stockStatusLoading } = useGetStockStatusQuery();

  // Calculate booking statistics
  const bookingStats = bookings
    ? {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter((b) => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalPrice, 0),
        recentBookings: [...bookings]
          .filter((b) => b.status === 'confirmed')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      }
    : null;

  console.log('All bookings:', bookings); // Temporary log to check bookings

  const isLoading = usersLoading || productsLoading || bookingsLoading || stockStatusLoading;

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 p-6 ml-[250px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userInfo?.username}</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Stock Alert Section */}
            {stockStatus?.lowStockAlert && (
              <div className="mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium">
                        {stockStatus.lowStockAlert.message}
                      </h3>
                      <div className="mt-2 space-y-1">
                        {stockStatus.lowStockAlert.products.map((product) => (
                          <p key={product._id} className="text-red-700">
                            {product.name}: {product.availableStock} units available (Total:{' '}
                            {product.totalStock})
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <FaUsers className="text-pink-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
                    <p className="text-3xl font-bold text-gray-800">{users?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaBox className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-600">Total Products</h2>
                    <p className="text-3xl font-bold text-gray-800">{products?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaCalendarCheck className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-600">Total Bookings</h2>
                    <p className="text-3xl font-bold text-gray-800">{bookingStats?.total || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FaDollarSign className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-600">Total Revenue</h2>
                    <p className="text-3xl font-bold text-gray-800">
                      ${bookingStats?.totalRevenue.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Booking Status Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-green-800 font-medium">Confirmed</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {bookingStats?.confirmed || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-red-800 font-medium">Cancelled</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {bookingStats?.cancelled || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                <div className="space-y-4">
                  {bookingStats?.recentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{booking.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {moment(booking.startDate).format('MMM D')} -{' '}
                          {moment(booking.endDate).format('MMM D, YYYY')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Customer: {booking.user?.username || booking.user?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-pink-600">${booking.totalPrice}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
