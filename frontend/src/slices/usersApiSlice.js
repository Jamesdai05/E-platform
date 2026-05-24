import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

/**
 * @typedef {Object} UsersApiSlice
 * @description Redux API slice for handling user-related operations
 *
 * @property {Object} endpoints Collection of API endpoints
 * @property {Object} login.mutation Authenticates user login
 * @property {Object} registration.mutation Registers new user
 * @property {Object} logout.mutation Handles user logout
 * @property {Object} updateprofile.mutation Updates user profile
 * @property {Object} getUsers.query Retrieves list of all users
 * @property {Object} deleteUser.mutation Deletes a user by ID
 * @property {Object} getUserDetails.query Gets details of specific user
 * @property {Object} updateUser.mutation Updates user information
 *
 * @remarks
 * - Uses RTK Query for API calls
 * - Implements caching with provideTags and invalidateTags
 * - Keeps unused data for 5 seconds in relevant queries
 */
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
      keepUnusedDataFor: 5,
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