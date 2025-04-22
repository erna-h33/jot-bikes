import { useGetTopProductsQuery } from '../../redux/api/productApiSlice';
import Message from '../../components/Message';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from 'moment';
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    appendDots: (dots) => (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-300" />
    ),
    prevArrow: (
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white mr-3 p-3 rounded-full transition-all duration-300">
          <svg className="w-6 h-6 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>
    ),
    nextArrow: (
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="rounded-lg overflow-hidden">
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
                countInStock,
              }) => (
                <Motion.div
                  key={_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative h-[700px]">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL
                      }${image}`}
                      alt={name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-80">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container px-10 mx-auto">
                          <Motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl text-white"
                          >
                            <h2 className="text-5xl font-bold mb-4 text-white">{name}</h2>
                            <p className="text-xl mb-6 text-gray-200">{description}</p>
                            <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-700">
                              <div className="flex items-center space-x-3">
                                <FaStore className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{brand}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <FaClock className="text-pink-500 text-xl" />
                                <span className="text-gray-300">
                                  Added {moment(createdAt).fromNow()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <FaStar className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{numReviews} Reviews</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <FaBox className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{countInStock} in Stock</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-8">
                              <span className="text-4xl font-bold text-white">${price}</span>
                              <a
                                href={`/product/${_id}`}
                                className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                View Details
                              </a>
                            </div>
                          </Motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
