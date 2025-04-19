import React from 'react';
import { useSelector } from 'react-redux';
import VendorMenu from './VendorMenu';
import { useGetVendorProductsQuery } from '../../redux/api/vendorApiSlice';
import { useGetVendorBookingsQuery } from '../../redux/api/bookingApiSlice';
import { FaBox, FaCalendarCheck, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import Loader from '../../components/Loader';
import moment from 'moment';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: products, isLoading: productsLoading } = useGetVendorProductsQuery();
  const { data: bookings, isLoading: bookingsLoading } = useGetVendorBookingsQuery();

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

  // Calculate low stock products
  const lowStockProducts = products
    ? products
        .filter((product) => product.countInStock < 3)
        .map((product) => ({
          _id: product._id,
          name: product.name,
          availableStock: product.countInStock,
          totalStock: product.countInStock,
        }))
    : [];

  const isLoading = productsLoading || bookingsLoading;

  return (
    <div className="flex">
      <VendorMenu />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userInfo?.name || 'Vendor'}</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Stock Alert Section */}
            {lowStockProducts.length > 0 && (
              <div className="mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium">Low Stock Alert</h3>
                      <div className="mt-2 space-y-1">
                        {lowStockProducts.map((product) => (
                          <p key={product._id} className="text-red-700">
                            {product.name}: {product.availableStock} units available
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
                    <FaBox className="text-pink-600 text-xl" />
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

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-600">Low Stock</h2>
                    <p className="text-3xl font-bold text-gray-800">{lowStockProducts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Booking Status Overview</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-yellow-800 font-medium">Confirmed</h3>
                    <p className="text-2xl font-bold text-yellow-600">
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
