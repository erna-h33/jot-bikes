import { Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/api/productApiSlice';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductGrid = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link
          to="/admin/productlist"
          className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Create New Product
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products?.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={
                        product.image && product.image.startsWith('http')
                          ? product.image
                          : `${
                              import.meta.env.VITE_API_URL ||
                              import.meta.env.VITE_PRODUCTION_API_URL
                            }${product.image}`
                      }
                      alt={product.name}
                      className="h-28 w-28 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-lg font-semibold text-pink-600 mt-1">${product.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Category:</span> {product.category?.name}
                  </div>
                  <div>
                    <span className="font-medium">Brand:</span> {product.brand}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {product.countInStock}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to={`/admin/updateproduct/${product._id}`}
                    className="bg-blue-100 text-blue-700 py-1 px-3 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-100 text-red-700 py-1 px-3 rounded-md hover:bg-red-200 transition-colors flex items-center"
                  >
                    <FaTrash className="mr-1" size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
