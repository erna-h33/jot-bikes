import { useState, useEffect } from 'react';
import VendorMenu from './VendorMenu';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateVendorProductMutation,
  useDeleteVendorProductMutation,
  useGetVendorProductsQuery,
} from '../../redux/api/vendorApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import Button from '../../components/Button';

const VendorProductUpdate = () => {
  const { id } = useParams();
  const { data: products } = useGetVendorProductsQuery();
  const [updateProduct] = useUpdateVendorProductMutation();
  const [deleteProduct] = useDeleteVendorProductMutation();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (products) {
      const product = products.find((p) => p._id === id);
      if (product) {
        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price?.toString() || '');
        setCategory(product.category?._id || '');
        setBrand(product.brand || '');
        setStock(product.countInStock?.toString() || '');
        setImagePreview(product.image || '');
      }
    }
  }, [products, id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!name || !description || !brand || !price || !stock || !category) {
        toast.error('All fields are required');
        return;
      }

      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('countInStock', stock);

      const result = await updateProduct({ id, data: formData });

      if (result.error) {
        console.error('Update error:', result.error);
        toast.error(result.error.data?.message || 'Update failed');
      } else {
        toast.success('Product successfully updated');
        navigate('/vendor/products');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Product update failed. Try again.');
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm('Are you sure you want to delete this product?');
      if (!answer) return;

      if (!id) {
        toast.error('Product ID is missing');
        return;
      }

      const result = await deleteProduct(id);
      if (result.error) {
        toast.error(result.error.data?.message || 'Delete failed');
      } else {
        toast.success('Product deleted successfully');
        navigate('/vendor/products');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Product deletion failed. Try again.');
    }
  };

  return (
    <div className="flex">
      <VendorMenu />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Update Product</h1>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              onClick={handleDelete}
            >
              Delete Product
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  className="w-full p-2 border rounded"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => navigate('/vendor/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
              >
                Update Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProductUpdate;
