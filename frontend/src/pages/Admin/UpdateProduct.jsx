import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(id);
  const { data: categories } = useFetchCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (product) {
      setImage(product.image);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category?._id);
      setQuantity(product.quantity);
      setBrand(product.brand);
      setStock(product.countInStock);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const formData = new FormData();
      if (image instanceof File) {
        formData.append('image', image);
      }
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('quantity', quantity);
      formData.append('brand', brand);
      formData.append('countInStock', stock);

      await updateProduct({ id, ...formData }).unwrap();
      toast.success('Product updated successfully');
      navigate('/admin/allproducts');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update product');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  if (productLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
          {image && (
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/allproducts')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
