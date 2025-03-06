import { ORDERS_URL, PAYPAL_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";


export const ordersApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    getOrders:builder.query({
      query:()=>({
        url:ORDERS_URL,
      }),
    providesTags:["Products"],
    }),
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
    payOrders:builder.mutation({
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
    })
  })
})


export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  usePayOrdersMutation,
  useGetPayPalClientIdQuery}=ordersApiSlice;

