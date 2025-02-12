import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../components/lib/Feature";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
const initialState={
    notificationCount:0,
    // reloading the page will not reset newMessagesAlert to {chatId:"",count:0}
    newMessagesAlert: getOrSaveFromStorage({
        key:NEW_MESSAGE_ALERT,
        get:true
    }) || [
        {
            chatId:"",
            count:0
        }
    ]
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
        },
        setNewMessagesAlert:(state,action)=>{
            const index=state.newMessagesAlert.findIndex((item)=>item.chatId===action.payload.chatId)
            if(index!=-1)
                state.newMessagesAlert[index].count+=1
            else
            {
                state.newMessagesAlert.push({
                    chatId:action.payload.chatId,
                    count:1
                })
            }
        },
        removeNewMessagesAlert:(state,action)=>{
            state.newMessagesAlert=state.newMessagesAlert.filter(item=>item.chatId!==action.payload)
        }
    }
})
export default chatSlice
export const {incrementNotifications,resetNotifications,setNewMessagesAlert,removeNewMessagesAlert}=chatSlice.actions