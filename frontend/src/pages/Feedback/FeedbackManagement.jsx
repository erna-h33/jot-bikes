import { useState } from 'react';
import {
  useGetAllFeedbackQuery,
  useUpdateFeedbackStatusMutation,
  useRespondToFeedbackMutation,
  useGetFeedbackStatsQuery,
} from '../../redux/api/feedbackApiSlice';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import { toast } from 'react-toastify';
import AdminMenu from '../Admin/AdminMenu';

const FeedbackManagement = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [responseText, setResponseText] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(null);

  const { data: feedbackData, isLoading, error } = useGetAllFeedbackQuery({ keyword });
  const { data: stats } = useGetFeedbackStatsQuery();

  const [updateStatus] = useUpdateFeedbackStatusMutation();
  const [respondToFeedback] = useRespondToFeedbackMutation();

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleResponse = async (id) => {
    try {
      await respondToFeedback({ id, message: responseText }).unwrap();
      setResponseText('');
      setActiveFeedback(null);
      toast.success('Response sent successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const filteredFeedback = feedbackData?.feedback?.filter((item) => {
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-pink-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminMenu />

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-gray-100 py-8 px-8 ml-[250px]">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Feedback</h3>
              <p className="text-3xl font-bold text-pink-600 mt-2">{stats?.total || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pending || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.inProgress || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats?.resolved || 0}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {filteredFeedback?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No feedback found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFeedback?.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.subject}</h3>
                            <p className="text-sm text-gray-500">
                              From: {item.user?.name} • {moment(item.createdAt).fromNow()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                                item.priority
                              )}`}
                            >
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">Type:</span>
                            <span className="text-sm text-gray-900">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">Category:</span>
                            <span className="text-sm text-gray-900">
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700">{item.message}</p>
                        </div>

                        {item.response && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Response:</h4>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <p className="text-gray-700">{item.response.message}</p>
                              <div className="mt-2 text-sm text-gray-500">
                                Responded by {item.response.respondedBy?.name} •{' '}
                                {moment(item.response.respondedAt).fromNow()}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                            className="border rounded-lg px-4 py-2 focus:ring-pink-500 focus:border-pink-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>

                          {!item.response && (
                            <button
                              onClick={() => setActiveFeedback(item._id)}
                              className="ml-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                              Respond
                            </button>
                          )}
                        </div>

                        {activeFeedback === item._id && (
                          <div className="mt-4">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Type your response..."
                              rows="4"
                              className="w-full border rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => setActiveFeedback(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleResponse(item._id)}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                              >
                                Send Response
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
