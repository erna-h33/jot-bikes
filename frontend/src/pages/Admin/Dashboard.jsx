import React from 'react';
import { useSelector } from 'react-redux';
import AdminMenu from './AdminMenu';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: products, isLoading: productsLoading } = useAllProductsQuery();

  // Calculate total revenue (placeholder for now)
  const totalRevenue = 0;

  // Placeholder for orders (to be implemented)
  const orders = [];

  const isLoading = usersLoading || productsLoading;

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 p-6 ml-[250px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userInfo?.name || 'Admin'}</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaShoppingCart className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-600">Total Orders</h2>
                  <p className="text-3xl font-bold text-gray-800">{orders?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaDollarSign className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-600">Total Revenue</h2>
                  <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
