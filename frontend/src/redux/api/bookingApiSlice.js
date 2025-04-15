import { apiSlice } from './apiSlice';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: '/api/bookings',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: '/api/bookings/my',
        credentials: 'include',
      }),
    }),
    getBookingById: builder.query({
      query: (id) => ({
        url: `/api/bookings/${id}`,
        credentials: 'include',
      }),
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/bookings/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'include',
      }),
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/api/bookings/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingApiSlice;
