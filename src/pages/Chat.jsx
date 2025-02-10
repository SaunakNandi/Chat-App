import React, { useCallback, useRef, useState,useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { gray, orange } from '../constants/Color'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponent'
import { FileMenu } from '../components/FileMenu'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { NEW_MESSAGE } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js'
import { useErrors, useSocketEvents } from '../hooks/hook.jsx'
import { useInfiniteScrollTop } from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc.js'


// See the return statement to understand how Chat is getting called and chatId is comming
const Chat = ({chatId,user}) => {
  const containerRef=useRef(null)
  // const fileMenuRef=useRef(null)
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null)
  const [page,setPage]=useState(1)
  const socket=getSocket()
  const dispatch=useDispatch()
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})  // only call when chatId is there
  const members=chatDetails?.data?.chat?.members

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true))
    setFileMenuAnchor(e.currentTarget)
  }
  // console.log(chatDetails?.data?.chat)
  const oldMessagesChunk=useGetMessagesQuery({chatId,page})


  // need to see and understand the working of useInfiniteScrollTop. Need ChatGPT to make me understand
  // renaming data and setData
  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(containerRef,oldMessagesChunk.data?.totalPages,page,setPage,oldMessagesChunk.data?.message)
  const errors=[
    {isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ]
  console.log("oldmessages",oldMessages)
  // console.log(messages)
  // user is me
  
  const sendMessage=(e)=>{
    e.preventDefault()
    if(!message.trim()) return
    
    // Emitting message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("")
  }

  useEffect(()=>{
    // when the chatId changes it trigger the useEffect and before the useEffect do its work the return statement is executed
    return()=>{
      setMessages([])
      setMessage("")
      setPage(1)
      setOldMessages([])
    }
  },[chatId])
  
  const newMessagesHandler=useCallback((data)=>{
     console.log(data)  
     if(data.chatId !== chatId) return
    setMessages(prev=>[...prev,data.message])
  },[])
  
  // [NEW_MESSAGE] is a dynammic variable, writting in this way means {'NEW_MESSAGE':newMessageHandler}
  const eventHandlerArr={[NEW_MESSAGE]:newMessagesHandler}   
  
  // custom hook
  useSocketEvents(socket,eventHandlerArr)
  useErrors(errors) 
  const allMessages=[...oldMessages,...messages]
  
  return chatDetails.isLoading? <Skeleton/>:(
    <>
      <Stack ref={containerRef} boxSizing={'border-box'} padding={'1rem'} spacing={'1rem'} bgcolor={gray} height={'90%'} 
      sx={{
        overflowX:'hidden',
        overflowY:'auto',
      }}>
        {/* Messages */}
        {
          allMessages.map((msg)=>(
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
          }} onClick={handleFileOpen}>
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
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat)