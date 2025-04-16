import { apiSlice } from './apiSlice';

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: '/api/bookings',
        method: 'POST',
        body: data,
      }),
    }),
    getMyBookings: builder.query({
      query: () => '/api/bookings/my-bookings',
      providesTags: ['Bookings'],
    }),
    getAllBookings: builder.query({
      query: () => '/api/bookings',
      providesTags: ['Bookings'],
    }),
    getStockStatus: builder.query({
      query: () => '/api/bookings/stock-status',
      providesTags: ['Bookings'],
    }),
    getVendorBookings: builder.query({
      query: () => '/api/bookings/vendor',
      providesTags: ['Bookings'],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ bookingId, status }) => ({
        url: `/api/bookings/${bookingId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Bookings'],
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/api/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookings'],
    }),
    getProductBookings: builder.query({
      query: (productId) => ({
        url: `/api/bookings/product/${productId}`,
        method: 'GET',
      }),
      providesTags: ['Bookings'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useGetStockStatusQuery,
  useGetVendorBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetProductBookingsQuery,
} = bookingApiSlice;
