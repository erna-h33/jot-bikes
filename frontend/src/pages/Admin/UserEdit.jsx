import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../redux/api/apiSlice';
import AdminMenu from './AdminMenu';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  const { data: user, isLoading, error } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      toast.error('Not authorized as an admin');
      return;
    }

    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setIsVendor(user.isVendor);
    }
  }, [user, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        id,
        username,
        email,
        isAdmin,
        isVendor,
      }).unwrap();
      toast.success('User updated successfully');
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (!userInfo || !userInfo.isAdmin) {
    return <Loader />;
  }

  return (
    <div className="flex">
      <AdminMenu />
      <div className="flex-1 ml-[250px] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
          <button
            onClick={() => navigate('/admin/userlist')}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Users
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error?.data?.message || 'An error occurred'}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                    Admin Access
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVendor"
                    checked={isVendor}
                    onChange={(e) => setIsVendor(e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVendor" className="ml-2 block text-sm text-gray-700">
                    Vendor Access
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors duration-200"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
