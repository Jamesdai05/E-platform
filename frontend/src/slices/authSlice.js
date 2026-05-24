import { createSlice } from "@reduxjs/toolkit";


// Retrieve userInfo from localStorage
// let userInfoFromStorage = null;
// try {
//   userInfoFromStorage = localStorage.getItem("userInfo");
// } catch (error) {
//   console.error("Failed to access localStorage:", error);
// }

const getUserInfoFromStorage = () => {
  if (typeof window !== "undefined") {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};


const initialState={
  userInfo: getUserInfoFromStorage(),
}

const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{
    setCredentials:(state,action)=>{
      state.userInfo=action.payload;
      if(typeof window !== "undefined"){
        localStorage.setItem("userInfo",JSON.stringify(action.payload))
      }
    },
    logout:(state,action)=>{
      state.userInfo=null;
      // localStorage.removeItem("userInfo")
      if(typeof window !== "undefined"){
        localStorage.clear();
      }
    }
  }
})

export const {setCredentials,logout}=authSlice.actions;
export default authSlice.reducer;