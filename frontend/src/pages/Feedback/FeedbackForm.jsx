import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateFeedbackMutation } from '../../redux/api/feedbackApiSlice';
import { toast } from 'react-toastify';
import {
  FaComments,
  FaHeadset,
  FaLightbulb,
  FaExclamationTriangle,
  FaSpinner,
} from 'react-icons/fa';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    type: 'general',
    subject: '',
    message: '',
    category: 'website',
    priority: 'medium',
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please sign in to submit feedback');
      return;
    }

    try {
      await createFeedback(formData).unwrap();
      toast.success('Feedback submitted successfully');
      setFormData({
        type: 'general',
        subject: '',
        message: '',
        category: 'website',
        priority: 'medium',
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: <FaComments /> },
    { value: 'support', label: 'Support Request', icon: <FaHeadset /> },
    { value: 'suggestion', label: 'Suggestion', icon: <FaLightbulb /> },
    { value: 'complaint', label: 'Complaint', icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">Share Your Feedback</h2>
            <p className="mt-2 text-white text-center">
              We value your input and are committed to improving your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Feedback Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {feedbackTypes.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: value }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === value
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="website">Website Experience</option>
                <option value="booking">Booking Process</option>
                <option value="payment">Payment</option>
                <option value="product">Product Related</option>
                <option value="vendor">Vendor Related</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="low">Low - General feedback or suggestion</option>
                <option value="medium">Medium - Issue affecting experience</option>
                <option value="high">High - Significant problem</option>
                <option value="urgent">Urgent - Critical issue</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
