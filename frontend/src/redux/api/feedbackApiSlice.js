import { apiSlice } from './apiSlice';
import { FEEDBACK_URL } from '../constants';

export const feedbackApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation({
      query: (data) => ({
        url: FEEDBACK_URL,
        method: 'POST',
        body: data,
      }),
    }),

    getMyFeedback: builder.query({
      query: () => ({
        url: `${FEEDBACK_URL}/my`,
      }),
      providesTags: ['Feedback'],
    }),

    getAllFeedback: builder.query({
      query: ({ keyword = '', pageNumber = '' }) => ({
        url: `${FEEDBACK_URL}?keyword=${keyword}&pageNumber=${pageNumber}`,
      }),
      providesTags: ['Feedback'],
    }),

    getVendorFeedback: builder.query({
      query: ({ keyword = '', pageNumber = '' }) => ({
        url: `${FEEDBACK_URL}/vendor?keyword=${keyword}&pageNumber=${pageNumber}`,
      }),
      providesTags: ['Feedback'],
    }),

    getFeedbackById: builder.query({
      query: (id) => ({
        url: `${FEEDBACK_URL}/${id}`,
      }),
      providesTags: ['Feedback'],
    }),

    updateFeedbackStatus: builder.mutation({
      query: ({ id, status, assignedTo }) => ({
        url: `${FEEDBACK_URL}/${id}/status`,
        method: 'PUT',
        body: { status, assignedTo },
      }),
      invalidatesTags: ['Feedback'],
    }),

    respondToFeedback: builder.mutation({
      query: ({ id, message }) => ({
        url: `${FEEDBACK_URL}/${id}/respond`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Feedback'],
    }),

    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `${FEEDBACK_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feedback'],
    }),

    getFeedbackStats: builder.query({
      query: () => ({
        url: `${FEEDBACK_URL}/stats`,
      }),
      providesTags: ['Feedback'],
    }),

    getVendorFeedbackStats: builder.query({
      query: () => ({
        url: `${FEEDBACK_URL}/vendor/stats`,
      }),
      providesTags: ['Feedback'],
    }),
  }),
});

export const {
  useCreateFeedbackMutation,
  useGetMyFeedbackQuery,
  useGetAllFeedbackQuery,
  useGetVendorFeedbackQuery,
  useGetFeedbackByIdQuery,
  useUpdateFeedbackStatusMutation,
  useRespondToFeedbackMutation,
  useDeleteFeedbackMutation,
  useGetFeedbackStatsQuery,
  useGetVendorFeedbackStatsQuery,
} = feedbackApiSlice;
