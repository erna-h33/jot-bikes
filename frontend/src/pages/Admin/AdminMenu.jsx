import { NavLink, useNavigate } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineTags,
  AiOutlineTeam,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineCalendar,
} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/auth/authSlice';

const AdminMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
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
    <div className="fixed left-0 top-0 h-screen shadow-lg w-[250px] z-[10000]">
      <div className="p-4 bg-white rounded-r-lg h-full flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Menu</h2>
        <ul className="list-none flex-grow flex flex-col justify-center">
          {/* Home */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineHome
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Home</span>
            </NavLink>
          </li>

          {/* Admin Dashboard */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/dashboard"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineDashboard
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Admin Dashboard</span>
            </NavLink>
          </li>

          {/* Category List */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/categorylist"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineTags
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Create Category</span>
            </NavLink>
          </li>

          {/* Product List */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/productlist"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineAppstore
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Create Product</span>
            </NavLink>
          </li>

          {/* All Products */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/allproductslist"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineAppstore
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>All Products</span>
            </NavLink>
          </li>

          {/* Manage Users */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/userlist"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineTeam
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Manage Users</span>
            </NavLink>
          </li>

          {/* Bookings */}
          <li className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/admin/bookings"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineCalendar
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Manage Bookings</span>
            </NavLink>
          </li>
        </ul>

        {/* User Profile and Logout Section */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="mb-3">
            <NavLink
              className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#1f2937',
                backgroundColor: isActive ? 'rgba(243, 244, 246, 0.5)' : 'transparent',
              })}
            >
              <AiOutlineUser
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Profile</span>
            </NavLink>
          </div>
          <div className="mb-3">
            <button
              onClick={logoutHandler}
              className="flex items-center w-full py-2 px-3 hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out text-gray-800 hover:translate-x-1"
            >
              <AiOutlineLogout
                className="mr-3 text-gray-800 transition-transform duration-300 group-hover:scale-110"
                size={20}
              />
              <span>Logout</span>
            </button>
          </div>
          {userInfo && (
            <div className="text-sm text-gray-500 px-3 py-2">
              Logged in as:{' '}
              <span className="font-medium">{userInfo.name || userInfo.username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
