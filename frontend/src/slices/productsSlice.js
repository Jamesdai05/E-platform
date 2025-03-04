import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    getProducts:builder.query({
      query:()=>({
        url:PRODUCTS_URL,
      }),
      // keepUnusedDataFor:1,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      // keepUnusedDataFor: 1, // Cache data for 5 seconds
    })
  }),
});

export const {useGetProductsQuery,useGetProductDetailsQuery}=productsApiSlice;