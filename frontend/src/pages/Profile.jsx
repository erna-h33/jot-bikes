import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateProfileMutation, useGetMyOrdersQuery } from '../redux/api/apiSlice';
import { setCredentials } from '../redux/features/auth/authSlice';
import Loader from '../components/Loader';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPic(userInfo.pic);
    }
  }, [userInfo]);

  if (!userInfo) {
    return <Loader />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
        pic,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="text"
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter URL for profile picture"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            {ordersLoading ? (
              <Loader />
            ) : orders?.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order._id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No orders found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
