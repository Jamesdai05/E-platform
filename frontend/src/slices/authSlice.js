import { createSlice } from "@reduxjs/toolkit";


// Retrieve userInfo from localStorage
let userInfoFromStorage = null;
try {
  userInfoFromStorage = localStorage.getItem("userInfo");
} catch (error) {
  console.error("Failed to access localStorage:", error);
}


const initialState={
  userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null,
}

const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{
    setCredentials:(state,action)=>{
      state.userInfo=action.payload;
      localStorage.setItem("userInfo",JSON.stringify(action.payload))
    },
    logout:(state,action)=>{
      state.userInfo=null;
      // localStorage.removeItem("userInfo")
      localStorage.clear();
    }
  }
})

export const {setCredentials,logout}=authSlice.actions;
export default authSlice.reducer;