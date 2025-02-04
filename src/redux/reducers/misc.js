import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:null,
    isAdmin:false,
    loader:true,
}
const miscSlice=createSlice({
    name:"misc",
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user=action.payload
            state.loader=false
        },
        userNotExists:(state)=>{
            state.user=null;
            state.loader=false;
        }
    }
})
export default miscSlice
export const {userExists,userNotExists}=miscSlice.actions