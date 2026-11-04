import { ORDERS_URL, PAYPAL_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";


export const ordersApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    // post the order to the database
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method:"POST",
        body:{...order},
      }),
      invalidatesTags:["Orders"],
    }),
    // get the order data
    getOrderDetails:builder.query({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor:5,
    }),
    // the backend creates the PayPal order from the saved total
    createPayPalPayment:builder.mutation({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}/paypal`,
        method:"POST",
      }),
    }),
    // the backend captures the money once the customer has approved
    capturePayPalPayment:builder.mutation({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}/paypal/capture`,
        method:"POST",
      }),
      invalidatesTags:["Orders"],
    }),
    getPayPalClientId:builder.query({
      query:()=>({
        url:PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    // get yourself data
    getmyorders:builder.query({
      query:()=>({
        url:`${ORDERS_URL}/mine`,
      }),
      providesTags:["Orders"],
    }),
    getallorders:builder.query({
      query:()=>({
        url:ORDERS_URL,
      }),
      providesTags:["Orders"],
      keepUnusedDataFor: 5,
    }),
    // update the status of the delivery.
    deliveredorder:builder.mutation({
      query:(orderId)=>({
        url:`${ORDERS_URL}/${orderId}`,
        method:"PUT",
      }),
      invalidatesTags:["Orders"],
      keepUnusedDataFor: 5,
    }),
  })
})


export const {
  useCreateOrderMutation,
  useGetmyordersQuery,
  useGetOrderDetailsQuery,
  useCreatePayPalPaymentMutation,
  useCapturePayPalPaymentMutation,
  useGetPayPalClientIdQuery,
  useGetallordersQuery,
  useDeliveredorderMutation,
}=ordersApiSlice;

