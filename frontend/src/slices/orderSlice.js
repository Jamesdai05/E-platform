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
  })
})


export const {useGetOrdersMutation} = ordersApiSlice;

