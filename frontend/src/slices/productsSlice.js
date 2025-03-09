import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    getProducts:builder.query({
      query:()=>({
        url:PRODUCTS_URL,
      }),
      keepUnusedDataFor:5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      // keepUnusedDataFor: 5, // Cache data for 5 seconds
    }),
    createProduct:builder.mutation({
      query:()=>({
        url:PRODUCTS_URL,
        method:"POST",
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct:builder.mutation({
      query:(data)=>({
        url:`${PRODUCTS_URL}/${data.productId}`,
        method:"PUT",
        body:data,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductimage:builder.mutation({
      query:(data)=>({
        url:`${PRODUCTS_URL}/${data.productId}`
      })
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
}=productsApiSlice;