import { useEffect } from 'react';
import { useGetUsersQuery } from '../../redux/api/apiSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../../redux/api/apiSlice';
import AdminMenu from './AdminMenu';

const UserList = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!userInfo.isAdmin) {
      navigate('/');
      toast.error('Not authorized as an admin');
      return;
    }

    console.log('Current user info:', userInfo);
    console.log('Admin status:', userInfo.isAdmin);
  }, [userInfo, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      toast.error(error?.data?.message || 'Failed to fetch users');
    }
  }, [error]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted');
        refetch();
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 ml-[250px] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaUsers className="mr-3 text-pink-500" />
            Manage Users
          </h1>
          <p className="text-gray-600 mt-2">
            {users ? `${users.length} users found` : 'Loading users...'}
          </p>
        </div>

        {loadingDelete && <Loader />}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error?.error || 'An error occurred'}
          </Message>
        ) : !users ? (
          <Message variant="info">No users found</Message>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left pl-8 font-medium">ID</th>
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Admin</th>
                    <th className="py-3 px-4 text-left font-medium">Vendor</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user?._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 pl-8 text-sm text-gray-700 truncate max-w-[150px]">
                        {user?._id || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {user?.name || user?.username || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{user?.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        {user?.isAdmin ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {user?.isVendor ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center space-x-4">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
                            title="View Details"
                          >
                            <FaUsers size={18} />
                          </Link>
                          <Link
                            to={`/admin/user/${user._id}/edit`}
                            className="text-pink-500 hover:text-pink-700 transition-colors duration-150"
                            title="Edit User"
                          >
                            <FaEdit size={18} />
                          </Link>
                          <button
                            className="text-pink-500 hover:text-pink-700 transition-colors duration-150"
                            onClick={() => deleteHandler(user._id)}
                            title="Delete User"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
