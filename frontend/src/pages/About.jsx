import { FaRoute, FaShieldAlt, FaUserFriends, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const About = () => {
  const services = [
    {
      icon: <FaRoute className="text-4xl text-white" />,
      title: 'Adventure Rides',
      description: "Explore Sydney's hidden gems with our guided bike tours.",
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-white" />,
      title: 'Safety First',
      description: 'Top-quality gear and comprehensive insurance coverage.',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: <FaUserFriends className="text-4xl text-white" />,
      title: 'Community',
      description: 'Join our growing community of cycling enthusiasts.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <FaTools className="text-4xl text-white" />,
      title: 'Expert Service',
      description: 'Professional maintenance and support for all bikes.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'%3E%3C/path%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-6xl md:text-7xl font-black mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                Experience the Joy of Cycling
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              Sydney's most innovative bike rental service, bringing adventure and sustainability
              together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all">
                Book Now
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
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
                alt="Cycling Adventure"
                className="relative rounded-3xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  At JotBikes, we're revolutionizing urban mobility in Sydney. What started as a
                  small rental shop in Redfern has grown into a movement, connecting people with the
                  pure joy of cycling.
                </p>
                <p>
                  We believe that every journey on two wheels is an opportunity for adventure,
                  discovery, and positive change in our community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
            <p className="text-xl text-gray-600">Discover what makes us different</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div
                  className={`p-8 rounded-3xl bg-gradient-to-br ${service.color} transform group-hover:scale-105 transition-all duration-300`}
                >
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-100">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
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

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'%3E%3C/path%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>
      </section>

      <ContactForm />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
