import { apiSlice } from './apiSlice';

export const rentalAgreementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRentalAgreement: builder.mutation({
      query: (data) => ({
        url: '/api/rental-agreements',
        method: 'POST',
        body: data,
      }),
    }),
    getRentalAgreementByBooking: builder.query({
      query: (bookingId) => `/api/rental-agreements/booking/${bookingId}`,
    }),
  }),
});

export const { useCreateRentalAgreementMutation, useGetRentalAgreementByBookingQuery } =
  rentalAgreementApiSlice;
