import { useGetAllBookingsQuery } from '../../redux/api/bookingApiSlice';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';

const AdminDashboard = () => {
  const { data: bookings = [] } = useGetAllBookingsQuery();
  const { data: products = [] } = useAllProductsQuery();

  // Calculate total revenue (excluding pending orders)
  const totalRevenue = bookings
    .filter((booking) => booking.status !== 'pending')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  // Get recent bookings (excluding pending)
  const recentBookings = bookings.filter((booking) => booking.status !== 'pending').slice(0, 5);

  // Calculate total bookings (excluding pending)
  const totalBookings = bookings.filter((booking) => booking.status !== 'pending').length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-2xl font-bold text-purple-600">{products.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${booking.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
