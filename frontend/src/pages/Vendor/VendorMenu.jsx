import { NavLink } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineLogout,
} from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/auth/authSlice';

const VendorMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[300px] min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Vendor Menu</h2>
          <div className="h-1 w-12 bg-pink-500 rounded-full"></div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 font-semibold text-lg">
                {userInfo?.name?.charAt(0) || 'V'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{userInfo?.vendorName || userInfo?.name}</p>
              <p className="text-sm text-gray-500">Vendor Account</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group"
              to="/vendor/dashboard"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#4b5563',
                backgroundColor: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              })}
            >
              <AiOutlineDashboard
                className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110"
                style={({ isActive }) => ({
                  color: isActive ? '#ec4899' : '#4b5563',
                })}
              />
              <span className="font-medium">Dashboard</span>
            </NavLink>
          </li>

          {/* My Products */}
          <li>
            <NavLink
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group"
              to="/vendor/products"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#4b5563',
                backgroundColor: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              })}
            >
              <AiOutlineAppstore
                className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110"
                style={({ isActive }) => ({
                  color: isActive ? '#ec4899' : '#4b5563',
                })}
              />
              <span className="font-medium">My Products</span>
            </NavLink>
          </li>

          {/* Bookings */}
          <li>
            <NavLink
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group"
              to="/vendor/bookings"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#4b5563',
                backgroundColor: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              })}
            >
              <AiOutlineCalendar
                className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110"
                style={({ isActive }) => ({
                  color: isActive ? '#ec4899' : '#4b5563',
                })}
              />
              <span className="font-medium">Bookings</span>
            </NavLink>
          </li>

          {/* Profile */}
          <li>
            <NavLink
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group"
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? '#ec4899' : '#4b5563',
                backgroundColor: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
              })}
            >
              <AiOutlineUser
                className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110"
                style={({ isActive }) => ({
                  color: isActive ? '#ec4899' : '#4b5563',
                })}
              />
              <span className="font-medium">Profile</span>
            </NavLink>
          </li>

          {/* Logout */}
          <li className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={logoutHandler}
              className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group w-full text-red-600 hover:bg-red-50"
            >
              <AiOutlineLogout className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorMenu;
