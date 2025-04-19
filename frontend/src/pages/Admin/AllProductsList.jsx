import { Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/api/productApiSlice';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AllProductsList = () => {
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
    <div className="container py-8 mt-[100px] ml-[250px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Link
          to="/admin/productlist"
          className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Create New Product
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products?.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex p-4">
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Price:</span> ${product.price}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span> {product.category?.name}
                    </p>
                    <p>
                      <span className="font-medium">Brand:</span> {product.brand}
                    </p>
                    <p>
                      <span className="font-medium">Stock:</span> {product.countInStock}
                    </p>
                    {product.size && (
                      <p>
                        <span className="font-medium">Size:</span> {product.size}
                      </p>
                    )}
                    {product.color && (
                      <p>
                        <span className="font-medium">Color:</span> {product.color}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex space-x-3">
                    <Link
                      to={`/admin/updateproduct/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProductsList;
