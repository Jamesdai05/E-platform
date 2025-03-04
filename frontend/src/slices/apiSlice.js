import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; //this is special, need to take care.
import { BASE_URL } from "../constants.js";

const baseQuery=fetchBaseQuery({baseUrl:BASE_URL})

export const apiSlice=createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes:['Product','User','Order'],
  endpoints:(builder)=>({}),
})