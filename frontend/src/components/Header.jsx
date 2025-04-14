import { useGetTopProductsQuery } from '../redux/api/productApiSlice';
import Loader from './Loader';
import SmallProduct from '../pages/Products/SmallProduct';
import ProductCarousel from '../pages/Products/ProductCarousel';

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Top Products Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Top Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.slice(0, 6).map((product) => (
            <div key={product._id} className="transform hover:scale-105 transition duration-300">
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Full Width Carousel */}
      <div className="w-full mb-12">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
