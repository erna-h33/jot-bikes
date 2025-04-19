import {
  FaRoute,
  FaShieldAlt,
  FaUserFriends,
  FaTools,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const About = () => {
  const features = [
    {
      icon: <FaRoute className="text-4xl text-white" />,
      title: 'Easy Booking',
      description: 'Simple and quick booking process for your next adventure.',
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-white" />,
      title: 'Premium Fleet',
      description: 'Top-quality bikes maintained to the highest standards.',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: <FaUserFriends className="text-4xl text-white" />,
      title: 'Flexible Rentals',
      description: 'Choose from hourly, daily, or weekly rental options.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <FaTools className="text-4xl text-white" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for your peace of mind.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section with Parallax */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                Your Journey Starts Here
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
              Experience Sydney's most innovative bike rental service, where adventure meets
              sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <FaQuoteLeft className="text-6xl text-pink-500 mx-auto mb-8" />
            <p className="text-2xl md:text-3xl text-white mb-8 leading-relaxed">
              "We're not just renting bikes; we're creating experiences that inspire people to
              explore, connect, and make a positive impact on our environment."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose JotBikes</h2>
            <p className="text-xl text-gray-600">
              Experience the difference with our premium service
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div
                  className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} transform group-hover:scale-105 transition-all duration-300`}
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-100">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3"
                alt="Our Story"
                className="relative rounded-3xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Starting from a small garage in Redfern, Sydney, JotBikes has grown into a leading
                  bike rental service. Our journey began with a simple mission: to make cycling
                  accessible to everyone while promoting sustainable transportation.
                </p>
                <p>
                  Today, we're proud to offer a diverse fleet of premium bikes, serving thousands of
                  happy customers across Sydney. Our commitment to quality, safety, and customer
                  satisfaction remains at the heart of everything we do.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8 text-center text-white">
                <div className="text-6xl font-bold mb-2">5K+</div>
                <div className="text-xl">Happy Riders</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8 text-center text-white">
                <div className="text-6xl font-bold mb-2">100+</div>
                <div className="text-xl">Premium Bikes</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-8 text-center text-white">
                <div className="text-6xl font-bold mb-2">4.9</div>
                <div className="text-xl">Customer Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FaMapMarkerAlt className="text-4xl text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Bike Street
                <br />
                Redfern, Sydney - Australia
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FaClock className="text-4xl text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 9:00 AM - 5:00 PM
                <br />
                Sunday: 10:00 AM - 4:00 PM
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FaPhoneAlt className="text-4xl text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <p className="text-gray-600">
                Phone: +1 234 567 8900
                <br />
                Email: info@jotbikes.com
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  );
};

export default About;
