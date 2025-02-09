import React, { useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { gray, orange } from '../constants/Color'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponent'
// import { FileMenu } from '../components/FileMenu'
import { sampleMessages } from '../constants/sample_data'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { NEW_MESSAGE } from '../constants/events'
import { useChatDetailsQuery } from '../redux/api/api.js'

// See the return statement to understand how Chat is getting called and chatId is comming
const Chat = ({chatId}) => {
  const containerRef=useRef(null)
  // const fileMenuRef=useRef(null)
  const socket=getSocket()
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})  // only call when chatId is there
  const members=chatDetails?.data?.chat?.members
  // console.log(chatDetails)
  const [message,setMessage]=useState("")
  // user is me
  const user={
    _id:'asfeffaa',
    name:'Daku Dhon'
  }
  const sendMessage=(e)=>{
    e.preventDefault()
    if(!message.trim()) return
    
    // Emitting message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("")
  }
  return chatDetails.isLoading? <Skeleton/>:(
    <>
      <Stack ref={containerRef} boxSizing={'border-box'} padding={'1rem'} spacing={'1rem'} bgcolor={gray} height={'90%'} 
      sx={{
        overflowX:'hidden',
        overflowY:'auto',
      }}>
        {/* Messages */}
        {
          sampleMessages.map((msg)=>(
            <MessageComponent message={msg} user={user} key={msg._id}/>
          ))
        }
      </Stack>
      <form style={{ height:'10%'}} onSubmit={sendMessage}>
        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'}>
          <IconButton
          sx={{
            position:'absolute',
            left:'1.5rem',
            rotate:'30deg'
          }} >
            <AttachFileIcon/>
          </IconButton>
          <InputBox placeholder='Type Message here' value={message} onChange={e=>setMessage(e.target.value)}/>
          <IconButton type='submit' sx={{
            backgroundColor:orange,
            color:'white',
            marginLeft:'1rem',
            padding:'0.5rem',
            "&:hover":{
              bgcolor:'error.dark'
            }
          }}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      {/* <FileMenu /> */}
    </>
  )
}

export default AppLayout()(Chat)