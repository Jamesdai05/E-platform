import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils.js";

// set the initialState to  the browser memory or to be an empty array
const initialState=localStorage.getItem("cart") ? JSON.parse(localStorage.getItem('cart')) : {cartItems:[],shippingAddress:{}}

// console.log(initialState);

const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
      addToCart:(state,action)=>{
        const item=action.payload;

        //to check the item whether exist in the current cart
        const existItem=state.cartItems.find(e=>e._id===item._id)
        // to check if the item exist and update the quantity.
        if(existItem){
          state.cartItems=state.cartItems.map(e=>e._id===existItem._id ? item : e)
        }else{
          state.cartItems=[...state.cartItems,item]
        }
        return updateCart(state)
      },
      removeFromCart:(state,action)=>{
        state.cartItems=state.cartItems.filter(e=>e._id !==action.payload)
        return updateCart(state)
      },
      saveShippingAddress:(state,action)=>{
        state.shippingAddress=action.payload
        return updateCart(state)
      },
      // savePaymentMethod:(state,action)=>{
      //   state.paymentMethod=action.payload
      //   return updateCart(state)
      // },
      // clearCartItems:(state,action)=>{
      //   state.cartItems=[]
      //   return updateCart(state)
      // }
    }
})

// export the actions
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;