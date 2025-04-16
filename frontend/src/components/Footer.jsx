import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">JotBikes</h3>
            <p className="mb-4">
              Your premier destination for bike rentals. Experience the joy of cycling with our
              quality bikes and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pink-500 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-pink-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-pink-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-pink-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-pink-500 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-pink-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <FaPhone className="mr-3 text-pink-500" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-pink-500" />
                <a
                  href="mailto:info@jotbikes.com"
                  className="hover:text-pink-500 transition-colors"
                >
                  info@jotbikes.com
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-pink-500" />
                <span>
                  123 Bike Street
                  <br />
                  Redfern, Sydney - Australia
                </span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} JotBikes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
