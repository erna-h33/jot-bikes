import React from 'react';
import { useGetFSNAnalysisQuery } from '../redux/api/productApiSlice';
import Loader from './Loader';
import { FaBolt, FaHourglassHalf, FaBan } from 'react-icons/fa';
import moment from 'moment';

const FSNAnalysis = () => {
  const { data: fsnData, isLoading, error } = useGetFSNAnalysisQuery();

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading FSN analysis</div>;

  const renderProductList = (products) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bookings (6 months)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Booked
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.countInStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.bookingCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.lastBooked ? moment(product.lastBooked).format('MMM D, YYYY') : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Fast Moving Products */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FaBolt className="text-yellow-500 text-xl" />
          <h2 className="text-xl font-semibold">Fast Moving Products</h2>
          <span className="ml-auto text-sm text-gray-500">{fsnData.fast.length} products</span>
        </div>
        {renderProductList(fsnData.fast)}
      </div>

      {/* Slow Moving Products */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FaHourglassHalf className="text-blue-500 text-xl" />
          <h2 className="text-xl font-semibold">Slow Moving Products</h2>
          <span className="ml-auto text-sm text-gray-500">{fsnData.slow.length} products</span>
        </div>
        {renderProductList(fsnData.slow)}
      </div>

      {/* Non-Moving Products */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FaBan className="text-red-500 text-xl" />
          <h2 className="text-xl font-semibold">Non-Moving Products</h2>
          <span className="ml-auto text-sm text-gray-500">{fsnData.nonMoving.length} products</span>
        </div>
        {renderProductList(fsnData.nonMoving)}
      </div>
    </div>
  );
};

export default FSNAnalysis;
