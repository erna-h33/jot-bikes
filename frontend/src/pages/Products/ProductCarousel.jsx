import { useGetTopProductsQuery } from '../../redux/api/productApiSlice';
import Message from '../../components/Message';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from 'moment';
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Slider {...settings}>
            {products.map(
              ({
                image,
                _id,
                name,
                price,
                description,
                brand,
                createdAt,
                numReviews,
                rating,
                countInStock,
              }) => (
                <div key={_id} className="relative">
                  <div className="relative h-[520px]">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                      }${image}`}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                      <div className="container mx-auto px-16">
                        <div className="max-w-2xl text-white">
                          <h2 className="text-4xl font-bold mb-4">{name}</h2>
                          <p className="text-lg mb-6">{description}</p>
                          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-700">
                            <div className="flex items-center">
                              <FaStore className="mr-2 text-pink-500" />
                              <span className="text-gray-300">Brand: {brand}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-2 text-pink-500" />
                              <span className="text-gray-300">
                                Added: {moment(createdAt).fromNow()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaStar className="mr-2 text-pink-500" />
                              <span className="text-gray-300">Reviews: {numReviews}</span>
                            </div>
                            <div className="flex items-center">
                              <FaBox className="mr-2 text-pink-500" />
                              <span className="text-gray-300">In Stock: {countInStock}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-start space-y-4">
                            <span className="text-3xl font-bold">${price}</span>
                            <a
                              href={`/product/${_id}`}
                              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition duration-300"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
