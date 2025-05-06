import { apiSlice } from '../api/apiSlice';

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorTransactions: builder.query({
      query: () => ({
        url: '/api/transactions/vendor',
        method: 'GET',
      }),
      providesTags: ['Transactions'],
    }),
    getAdminTransactions: builder.query({
      query: () => ({
        url: '/api/transactions/admin',
        method: 'GET',
      }),
      providesTags: ['Transactions'],
    }),
    getUserTransactions: builder.query({
      query: () => ({
        url: '/api/transactions/my-transactions',
        method: 'GET',
      }),
      providesTags: ['Transactions'],
    }),
    getTransactionById: builder.query({
      query: (id) => ({
        url: `/api/transactions/${id}`,
        method: 'GET',
      }),
      providesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetVendorTransactionsQuery,
  useGetAdminTransactionsQuery,
  useGetUserTransactionsQuery,
  useGetTransactionByIdQuery,
} = transactionApiSlice;
