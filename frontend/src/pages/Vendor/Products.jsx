import React from 'react';
import { Link } from 'react-router-dom';
import VendorMenu from './VendorMenu';
import {
  useGetVendorProductsQuery,
  useDeleteVendorProductMutation,
} from '../../redux/api/vendorApiSlice';
import { FaEdit, FaTrash, FaBox, FaTag, FaWarehouse } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const Products = () => {
  const [deleteProduct] = useDeleteVendorProductMutation();
  const { data: products, isLoading, error } = useGetVendorProductsQuery();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div className="flex">
      <VendorMenu />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <Link
            to="/vendor/products/new"
            className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <FaBox className="text-sm" />
            Add New Product
          </Link>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products?.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-4">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                      }${product.image}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-3/4 p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                        <p className="text-pink-600 font-bold text-lg">${product.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/vendor/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <FaEdit size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaTag className="text-pink-500" />
                        <span className="text-sm">{product.brand}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaWarehouse className="text-pink-500" />
                        <span className="text-sm">Stock: {product.countInStock}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBox className="text-pink-500" />
                        <span className="text-sm">Quantity: {product.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
