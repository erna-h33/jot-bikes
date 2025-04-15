import { apiSlice } from './apiSlice';

export const vendorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorProfile: builder.query({
      query: () => ({
        url: '/api/vendors/profile',
        method: 'GET',
      }),
    }),
    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: '/api/vendors/profile',
        method: 'PUT',
        body: data,
      }),
    }),
    getVendorProducts: builder.query({
      query: () => ({
        url: '/api/vendors/products',
        method: 'GET',
      }),
    }),
    createVendorProduct: builder.mutation({
      query: (data) => ({
        url: '/api/vendors/products',
        method: 'POST',
        body: data,
        formData: true,
      }),
    }),
    updateVendorProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/vendors/products/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteVendorProduct: builder.mutation({
      query: (id) => ({
        url: `/api/vendors/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useGetVendorProductsQuery,
  useCreateVendorProductMutation,
  useUpdateVendorProductMutation,
  useDeleteVendorProductMutation,
} = vendorApiSlice;
