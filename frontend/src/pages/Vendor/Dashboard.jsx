import React from 'react';
import { useSelector } from 'react-redux';
import VendorMenu from './VendorMenu';
import { useGetVendorProductsQuery } from '../../redux/api/vendorApiSlice';
import { FaBox, FaUser, FaCheckCircle } from 'react-icons/fa';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: products, isLoading } = useGetVendorProductsQuery();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <FaUser className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-600">Vendor Name</h2>
                  <p className="text-xl font-bold text-gray-800">{userInfo?.name || 'Not Set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaCheckCircle className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-600">Account Status</h2>
                  <p className="text-xl font-bold text-green-600">Active</p>
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
