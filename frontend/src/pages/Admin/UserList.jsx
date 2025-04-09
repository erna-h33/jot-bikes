import { useEffect } from 'react';
import { useGetUsersQuery } from '../../redux/api/apiSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useDeleteUserMutation } from '../../redux/api/apiSlice';

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

  return (
    <div className="ml-14 md:ml-20 lg:ml-24 xl:ml-28 mr-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Users</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || 'An error occurred'}
        </Message>
      ) : !users ? (
        <Message variant="info">No users found</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left pl-8">ID</th>
                <th className="py-2 px-4 border-b text-left">NAME</th>
                <th className="py-2 px-4 border-b text-left">EMAIL</th>
                <th className="py-2 px-4 border-b text-left">ADMIN</th>
                <th className="py-2 px-4 border-b text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b pl-8">{user._id}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {user.isAdmin ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/admin/user/${user._id}/edit`}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
