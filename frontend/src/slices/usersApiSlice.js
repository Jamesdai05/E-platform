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
    }),
    logout:builder.mutation({
      query: () => ({
      url: `${USERS_URL}/logout`,
      method:"POST",
      }),
    }),
    updateprofile:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/profile`,
        method:"PUT",
        body:data,
      }),
    }),
    getUsers:builder.query({
      query:()=>({
        url:USERS_URL,
        method:"GET",
      }),
      providesTags: ["USER"],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['USER'],
    }),
    getUserDetails:builder.query({
      query:(userId)=>({
        url:`${USERS_URL}/${userId}`,
        method:"GET",
      }),
      providesTags: ["USER"],
      keepUnusedDataFor: 5,
    }),
    updateUser:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/${data.userId}`,
        method:"PUT",
        body: data,
      }),
      invalidatesTags: ["USER"],
      keepUnusedDataFor: 5,-
    })
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useLogoutMutation,
  useUpdateprofileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
}=usersApiSlice;