import { ORDERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";


export const ordersApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    getOrders:builder.query({
      query:()=>({
        url:ORDERS_URL,
      }),
    providesTags:["Products"],
    }),
    createOrders: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method:"POST",
        body:{...order},
      }),
    })
  })
})


export const {useCreateOrdersMutation,useGetOrdersQuery}=ordersApiSlice;

