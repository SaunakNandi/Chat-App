import { createSlice } from "@reduxjs/toolkit";
const initialState={
    notificationCount:0
}
const chatSlice=createSlice({
    name:"chat",
    initialState,
    reducers:{
        incrementNotifications:(state)=>{
            state.notificationCount+=1
        },
        resetNotifications:(state)=>{
            state.notificationCount=0
        }
    }
})
export default chatSlice
export const {incrementNotifications,resetNotifications}=chatSlice.actions