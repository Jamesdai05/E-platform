import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; //this is special, need to take care.
import { BASE_URL } from "../constants.js";
import { logout } from "./authSlice.js";

const baseQuery=fetchBaseQuery({baseUrl:BASE_URL})

// A 401 means the login has expired, so stop showing the user as logged in.
// A failed login attempt also returns 401, but there is no session to end.
const baseQueryWithLogout=async(args,api,extraOptions)=>{
  const result=await baseQuery(args,api,extraOptions);

  if(result.error?.status===401 && api.endpoint!=="login" && api.getState().auth?.userInfo){
    api.dispatch(logout());
  }

  return result;
}

export const apiSlice=createApi({
  reducerPath: "api",
  baseQuery:baseQueryWithLogout,
  tagTypes:['Product','USER','Orders'],
  endpoints:(builder)=>({}),
})