import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://jot-bikes.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: () => ({}),
});

// Export hooks for usage in components
export const { useGetUsersQuery } = apiSlice;

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/api/users',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    // Add other user-related endpoints here
  }),
});

export const { useGetUsersQuery: useGetUsersQueryFromUsersApiSlice } = usersApiSlice;
