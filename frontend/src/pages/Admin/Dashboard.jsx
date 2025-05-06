import React from 'react';
import { useSelector } from 'react-redux';
import AdminMenu from './AdminMenu';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';
import { useGetAllBookingsQuery, useGetStockStatusQuery } from '../../redux/api/bookingApiSlice';
import { useGetAdminTransactionsQuery } from '../../redux/api/transactionApiSlice';
import {
  FaUsers,
  FaBox,
  FaCalendarCheck,
  FaDollarSign,
  FaExclamationTriangle,
  FaShoppingCart,
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import moment from 'moment';
import FSNAnalysis from '../../components/FSNAnalysis';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: products, isLoading: productsLoading } = useAllProductsQuery();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookingsQuery();
  const { data: stockStatus, isLoading: stockStatusLoading } = useGetStockStatusQuery();
  const { data: transactions, isLoading: transactionsLoading } = useGetAdminTransactionsQuery();

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

  // Calculate transaction statistics
  const transactionStats = transactions
    ? {
        total: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + t.total, 0),
        recentTransactions: [...transactions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      }
    : {
        total: 0,
        totalRevenue: 0,
        recentTransactions: [],
      };

  // Separate transactions by type
  const saleTransactions = transactionStats.recentTransactions.filter((t) => t.type === 'purchase');

  // Calculate revenue by type
  const rentalRevenue = bookingStats?.totalRevenue || 0;
  const saleRevenue = saleTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalRevenue = rentalRevenue + saleRevenue;

  const isLoading =
    usersLoading || productsLoading || bookingsLoading || stockStatusLoading || transactionsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
                        <p className="text-3xl font-bold text-gray-800">
                          {bookingStats?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaShoppingCart className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-600">Total Transactions</h2>
                        <p className="text-3xl font-bold text-gray-800">
                          {transactionStats?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <FaDollarSign className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-600">Total Revenue</h2>
                        <p className="text-3xl font-bold text-gray-800">
                          ${totalRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaCalendarCheck className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-600">Bookings Revenue</h2>
                        <p className="text-3xl font-bold text-gray-800">
                          ${rentalRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-pink-100 p-3 rounded-full">
                        <FaShoppingCart className="text-pink-600 text-xl" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-600">Sales Revenue</h2>
                        <p className="text-3xl font-bold text-gray-800">
                          ${saleRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Recent Bookings Section */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                    {bookingStats?.recentBookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookingStats.recentBookings.map((booking) => (
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
                                Customer:{' '}
                                {booking.user?.username || booking.user?.name || 'Unknown'}
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
                    ) : (
                      <p className="text-gray-500 text-center">No recent bookings found.</p>
                    )}
                  </div>

                  {/* Recent Sales Section */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
                    {saleTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {saleTransactions.map((transaction) => (
                          <div
                            key={transaction._id}
                            className="flex items-center justify-between border-b pb-2"
                          >
                            <div>
                              <p className="font-medium">
                                {transaction.items.map((item) => item.name).join(', ')}
                              </p>
                              <p className="text-sm text-gray-500">
                                {moment(transaction.createdAt).format('MMM D, YYYY h:mm A')}
                              </p>
                              <p className="text-sm text-gray-600">
                                Customer:{' '}
                                {transaction.user?.vendorName ||
                                  transaction.user?.username ||
                                  'Unknown'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Vendor:{' '}
                                {transaction.vendor?.vendorName ||
                                  transaction.vendor?.username ||
                                  'Unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-pink-600">
                                ${transaction.total.toFixed(2)}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  transaction.isPaid
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {transaction.isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No sale transactions found.</p>
                    )}
                  </div>
                </div>

                {/* FSN Analysis */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Inventory Analysis (FSN)</h2>
                  <FSNAnalysis />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
