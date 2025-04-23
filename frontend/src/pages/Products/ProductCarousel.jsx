import { useGetTopProductsQuery } from '../../redux/api/productApiSlice';
import Message from '../../components/Message';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from 'moment';
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    appendDots: (dots) => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ul className="flex space-x-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-300 cursor-pointer" />
    ),
    prevArrow: (
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-300 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-300 cursor-pointer">
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
        <div className="rounded-2xl overflow-hidden shadow-2xl">
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
                  <div className="relative h-[600px] bg-gray-900 -mb-3">
                    <div className="absolute inset-0 flex items-center z-10 pl-10">
                      <div className="container mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <Motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white space-y-10"
                          >
                            <div className="space-y-4">
                              <h2 className="text-5xl font-bold leading-tight">{name}</h2>
                              <p className="text-xl text-gray-300 max-w-lg">
                                {description.length > 150
                                  ? `${description.substring(0, 150)}...`
                                  : description}
                              </p>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <FaStore className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{brand}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaStar className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{numReviews} Reviews</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <FaBox className="text-pink-500 text-xl" />
                                <span className="text-gray-300">{countInStock} in Stock</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaClock className="text-pink-500 text-xl" />
                                <span className="text-gray-300">
                                  Added {moment(createdAt).fromNow()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-8 pt-4">
                              <span className="text-4xl font-bold text-white">${price}</span>
                              <Link
                                to={`/product/${_id}`}
                                className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                              >
                                <FaShoppingCart />
                                <span>View Details</span>
                              </Link>
                            </div>
                          </Motion.div>

                          <Motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="hidden lg:block"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50 rounded-2xl" />
                              <img
                                src={`${
                                  import.meta.env.VITE_API_URL ||
                                  import.meta.env.VITE_PRODUCTION_API_URL
                                }${image}`}
                                alt={name}
                                className="w-full h-[400px] object-contain rounded-2xl transform hover:scale-105 transition duration-500"
                              />
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
