import { ORDERS_URL, PAYPAL_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";


export const ordersApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method:"POST",
        body:{...order},
      }),
    }),
    getOrderDetails:builder.query({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor:5,
    }),
    payOrder:builder.mutation({
      query:({orderId,details})=>({
        url:`${ORDERS_URL}/${orderId}/pay`,
        method:"PUT",
        body:{...details}
      })
    }),
    getPayPalClientId:builder.query({
      query:()=>({
        url:PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getmyorders:builder.query({
      query:()=>({
        url:`${ORDERS_URL}/mine`,
      }),
    providesTags:["Products"],
    }),
    getallorders:builder.query({
      query:()=>({
        url:ORDERS_URL,
      }),
    providesTags:["Products"],
    keepUnusedDataFor: 5,
    }),
    deliveredorder:builder.mutation({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}`,
        method:"PUT",
      }),
    providesTags:["Products"],
    keepUnusedDataFor: 5,
    }),
  })
})


export const {
  useCreateOrderMutation,
  useGetmyordersQuery,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetallordersQuery,
  useDeliveredorderMutation,
}=ordersApiSlice;

