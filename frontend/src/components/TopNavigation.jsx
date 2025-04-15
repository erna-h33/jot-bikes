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
  AiOutlineLogout,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice';
import { logout } from '../redux/features/auth/authSlice';

const TopNavigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    console.log('User Info:', userInfo);
    console.log('User Info Details:', {
      name: userInfo?.name,
      username: userInfo?.username,
      email: userInfo?.email,
      isVendor: userInfo?.isVendor,
    });
  }, [userInfo]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      closeDropdown();
    } catch (error) {
      console.error(error);
    }
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-black bg-opacity-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
            Jot Bikes
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/shop?category=Bike%20Service"
              className="text-white hover:text-pink-400 transition-colors"
            >
              Bike Service
            </Link>
            <Link to="/shop" className="text-white hover:text-pink-400 transition-colors">
              Shop
            </Link>
            <Link to="/cart" className="text-white hover:text-pink-400 transition-colors relative">
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-5 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 pb-1 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
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
                  <span>{userInfo.name}</span>
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
                    {userInfo.isAdmin && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineDashboard className="mr-2" size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/allproductslist"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineAppstore className="mr-2" size={18} />
                          All Products
                        </Link>
                        <Link
                          to="/admin/categorylist"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineTags className="mr-2" size={18} />
                          Categories
                        </Link>
                        <Link
                          to="/admin/orderlist"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineOrderedList className="mr-2" size={18} />
                          Orders
                        </Link>
                        <Link
                          to="/admin/userlist"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineTeam className="mr-2" size={18} />
                          Users
                        </Link>
                      </>
                    )}

                    {/* Vendor menu items */}
                    {userInfo.isVendor && (
                      <>
                        <Link
                          to="/vendor/dashboard"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineDashboard className="mr-2" size={18} />
                          Vendor Dashboard
                        </Link>
                        <Link
                          to="/vendor/products"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineAppstore className="mr-2" size={18} />
                          My Products
                        </Link>
                        <Link
                          to="/vendor/products/new"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <AiOutlineAppstore className="mr-2" size={18} />
                          Add New Product
                        </Link>
                      </>
                    )}

                    {/* Common menu items */}
                    <Link
                      to="/profile"
                      onClick={closeDropdown}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      <AiOutlineUser className="mr-2" size={18} />
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 w-full"
                    >
                      <AiOutlineLogout className="mr-2" size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-pink-400 transition-colors"
                >
                  <AiOutlineLogin className="mr-1" size={18} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-white hover:text-pink-400 transition-colors"
                >
                  <AiOutlineUserAdd className="mr-1" size={18} />
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
