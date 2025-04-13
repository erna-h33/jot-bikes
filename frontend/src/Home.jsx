import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from './redux/api/productApiSlice.js';
import Loader from './components/Loader';
import Message from './components/Message';
import Header from './components/Header';
import Product from './pages/Products/Product';
import { FaArrowRight, FaMotorcycle, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  const features = [
    {
      icon: <FaMotorcycle className="text-4xl text-pink-600" />,
      title: 'Premium Bikes',
      description: 'Discover our collection of high-quality bikes',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-pink-600" />,
      title: 'Secure Shopping',
      description: 'Your security is our top priority',
    },
    {
      icon: <FaHeadset className="text-4xl text-pink-600" />,
      title: '24/7 Support',
      description: 'Expert assistance whenever you need it',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full mb-10">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Jot Bikes
              </h1>
              <p className="text-2xl md:text-3xl text-gray-200 mb-8 font-light">
                Australia's Number 1 Electric Bike & Scooter Retailer
              </p>
              <div className="space-y-4 text-lg text-gray-200 mb-12 max-w-2xl">
                <p className="font-light">
                  Based in Redfern, Sydney, we offer the highest quality range of E-Bikes and
                  E-Scooters with Fast Shipping Australia-wide and excellent customer service.
                </p>
                <p className="font-light">
                  We specialise in a range of brands including Dragon, Kristall, NCM, The Cullen,
                  Vamos, Bolzzen, Dulatron, Inokim, Kaabo, Mercane, Segway, Vsett, Xiaomi, Zero and
                  many more!
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center bg-pink-600 text-white px-8 pb-3 pt-2 rounded text-lg font-medium hover:bg-pink-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Shop Now
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error || 'An error occurred'}
        </Message>
      ) : (
        <>
          {/* Features Section */}
          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Featured Products Section */}
            <div className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                <Link
                  to="/shop"
                  className="text-pink-600 hover:text-pink-700 font-semibold flex items-center"
                >
                  View All
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.products.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="transform hover:scale-105 transition duration-300"
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
