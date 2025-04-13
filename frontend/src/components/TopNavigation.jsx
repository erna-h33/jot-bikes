import { useState, useEffect } from 'react';
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineTags,
  AiOutlineOrderedList,
  AiOutlineTeam,
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice';
import { logout } from '../redux/features/auth/authSlice';

const TopNavigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled ? 'bg-black bg-opacity-70' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
            Jot Bikes
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-pink-400 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-pink-400 transition-colors">
              Shop
            </Link>
            <Link to="/cart" className="text-white hover:text-pink-400 transition-colors">
              Cart
            </Link>
            <Link to="/favorite" className="text-white hover:text-pink-400 transition-colors">
              Favorites
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-white hover:text-pink-400 transition-colors"
                >
                  <span>{userInfo.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 ${dropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-10">
                    {/* Admin menu items */}
                    {userInfo && userInfo.isAdmin && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineDashboard className="mr-2" size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/allproductslist"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineAppstore className="mr-2" size={18} />
                          All Products
                        </Link>
                        <Link
                          to="/admin/categorylist"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineTags className="mr-2" size={18} />
                          Categories
                        </Link>
                        <Link
                          to="/admin/orderlist"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineOrderedList className="mr-2" size={18} />
                          Orders
                        </Link>
                        <Link
                          to="/admin/userlist"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineTeam className="mr-2" size={18} />
                          Users
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                      </>
                    )}

                    {/* Common menu items for all users */}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      <AiOutlineUser className="mr-2" size={18} />
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      <AiOutlineUserAdd className="mr-2" size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-pink-400 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-600 text-white px-4 pb-2 mt-2 rounded hover:bg-pink-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
