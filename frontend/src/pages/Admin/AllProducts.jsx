import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAllProductsQuery } from '../../redux/api/productApiSlice';
import AdminMenu from './AdminMenu';
import { FaBox } from 'react-icons/fa';

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  // Sort products alphabetically by name
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto max-w-[75%] pb-10 ml-[20%]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-full p-3">
          <div className="text-2xl font-bold my-8">All Products ({products.length})</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                    }${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{product?.name}</h3>
                    <p className="text-lg font-semibold text-pink-600 mt-1">$ {product?.price}</p>
                    <div className="flex items-center mt-2 text-gray-600">
                      <FaBox className="mr-2" />
                      <span>Stock: {product.countInStock} units</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      {moment(product.createdAt).format('MMMM Do YYYY')}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product?.description?.substring(0, 160)}...
                  </p>

                  <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="bg-blue-100 text-blue-700 py-1 px-3 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                    >
                      Update Product
                      <svg
                        className="w-3.5 h-3.5 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
