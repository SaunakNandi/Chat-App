import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../shared/ChatItem'
export const ChatList = ({w="100%",chats=[],chatId,onlineUsers=[],
    newMessagesAlert=[
        {
            chatId:'0',
            count:0
        },
    ],
    handleDeleteChat,
    }) => {
  return (
    <Stack width={w} direction={'column'} sx={{overflowY:'auto',height:'100%'}}>
        {
            chats?.map((data,index)=>{
                const {_id,avatar,name,groupChat,members}=data
                // console.log(newMessagesAlert,data)
                const newMessageAlert=newMessagesAlert.find((alert)=>alert.chatId === _id)
                // console.log(newMessageAlert)
                
                // const isOnline=onlineUsers.includes(_id)
                const isOnline=members?.some((member)=>onlineUsers.includes(member))
                return (<ChatItem newMessageAlert={newMessageAlert} isOnline={isOnline} avatar={avatar}
                name={name} _id={_id} key={_id} groupChat={groupChat}
                sameSender={chatId===_id}
                handleDeleteChat={handleDeleteChat}
                index={index}/>)
            })
        }
    </Stack>
  )
}

export default ChatList