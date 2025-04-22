import { useGetMyFeedbackQuery } from '../../redux/api/feedbackApiSlice';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import moment from 'moment';
import PageHero from '../../components/PageHero';
import { useSelector } from 'react-redux';

const MyFeedback = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: feedback,
    isLoading,
    error,
    isError,
  } = useGetMyFeedbackQuery(undefined, {
    skip: !userInfo,
  });

  console.log('MyFeedback component rendered');
  console.log('User info:', userInfo);
  console.log('Feedback data:', feedback);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);
  console.log('Is error:', isError);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'in-progress':
        return <FaSpinner className="text-blue-500" />;
      default:
        return <FaExclamationCircle className="text-red-500" />;
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

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <PageHero
          title="My Feedback"
          description="Track the status of your feedback and view responses"
          backgroundImage="/public/images/feedbackHero.webp"
        />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Please sign in to view your feedback
            </h2>
            <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <PageHero
          title="My Feedback"
          description="Track the status of your feedback and view responses"
          backgroundImage="/public/images/feedbackHero.webp"
        />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-pink-600" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <PageHero
          title="My Feedback"
          description="Track the status of your feedback and view responses"
          backgroundImage="/public/images/feedbackHero.webp"
        />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600">Error Loading Feedback</h2>
            <p className="mt-2 text-gray-600">
              {error?.data?.message ||
                error?.error ||
                'An error occurred while loading your feedback.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <PageHero
        title="My Feedback"
        description="Track the status of your feedback and view responses"
        backgroundImage="/public/images/feedbackHero.webp"
      />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white">My Feedback History</h2>
            <p className="mt-2 text-white opacity-90">
              Track the status of your feedback and view responses
            </p>
          </div>

          <div className="p-6">
            {!feedback || feedback.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't submitted any feedback yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {feedback.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.subject}</h3>
                          <p className="text-sm text-gray-500">
                            Submitted {moment(item.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
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
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">Category:</span>
                          <span className="text-sm text-gray-900">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">Priority:</span>
                          <span className="text-sm text-gray-900">
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFeedback;
