import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://jot-bikes.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      console.log('Setting Authorization header with token:', token);
    } else {
      console.log('No token found in Redux store');
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Category'],
  endpoints: () => ({}),
});

// This is the correct way to inject endpoints
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

// Export the hook with a clear name
export const { useGetUsersQuery } = usersApiSlice;

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/users/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/api/users/profile',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetProfileQuery } =
  authApiSlice;
