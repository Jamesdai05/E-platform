import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice=apiSlice.injectEndpoints({
  endpoints:(builder)=>({
    login:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/login`,
        method:"POST",
        body:data,
      }),
      providesTags: ['USER'],
    }),
    registration: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method:"POST",
        body:data,
      }),
    })
  }),
});

export const {useLoginMutation,useRegistrationMutation}=usersApiSlice;