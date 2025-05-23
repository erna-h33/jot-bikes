import { PRODUCTS_URL } from '../features/constants';
import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: PRODUCTS_URL,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
      transformResponse: (response) => {
        if (response.products) {
          return {
            ...response,
            products: response.products.map((product) => ({
              ...product,
              vendor: product.vendor || null,
            })),
          };
        }
        return response;
      },
    }),

    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      transformResponse: (response) => ({
        ...response,
        vendor: response.vendor || null,
      }),
    }),

    allProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/allproducts`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
      transformResponse: (response) => {
        return response.map((product) => ({
          ...product,
          vendor: product.vendor || null,
          image: product.image?.startsWith('http')
            ? product.image
            : product.image?.startsWith('/uploads')
            ? `${import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL}${
                product.image
              }`
            : product.image
            ? `https://res.cloudinary.com/${
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
              }/image/upload/${product.image}`
            : '/uploads/default.jpg',
        }));
      },
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      transformResponse: (response) => ({
        ...response,
        vendor: response.vendor || null,
      }),
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'PUT',
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { productId }) => [
        'Products',
        { type: 'Product', id: productId },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/new`,
      }),
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: 'POST',
        body: { checked, radio },
      }),
      transformResponse: (response) => {
        return response.map((product) => ({
          ...product,
          vendor: product.vendor || null,
        }));
      },
    }),

    getFSNAnalysis: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/fsn-analysis`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
  useGetFSNAnalysisQuery,
} = productApiSlice;
