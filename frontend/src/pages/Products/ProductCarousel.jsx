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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem]  lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
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
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={`http://localhost:5000${image}`}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="mt-4">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-2xl font-bold text-pink-600">${price}</p>
                  </div>

                  <p className="text-gray-600 mb-4">{description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaStore className="mr-2 text-pink-600" />
                      <span>Brand: {brand}</span>
                    </div>

                    <div className="flex items-center">
                      <FaClock className="mr-2 text-pink-600" />
                      <span>Added: {moment(createdAt).fromNow()}</span>
                    </div>

                    <div className="flex items-center">
                      <FaStar className="mr-2 text-pink-600" />
                      <span>Reviews: {numReviews}</span>
                    </div>

                    <div className="flex items-center">
                      <FaStar className="mr-2 text-pink-600" />
                      <span>Rating: {Math.round(rating)}</span>
                    </div>

                    <div className="flex items-center">
                      <FaShoppingCart className="mr-2 text-pink-600" />
                      <span>Quantity: {quantity}</span>
                    </div>

                    <div className="flex items-center">
                      <FaBox className="mr-2 text-pink-600" />
                      <span>In Stock: {countInStock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
