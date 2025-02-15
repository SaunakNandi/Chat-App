import React, { useCallback, useRef, useState,useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { gray, orange } from '../constants/Color'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponent'
import { FileMenu } from '../components/FileMenu'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js'
import { useErrors, useSocketEvents } from '../hooks/hook.jsx'
import { useInfiniteScrollTop } from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc.js'
import { removeNewMessagesAlert } from '../redux/reducers/chat.js'
import { TypingLoader } from '../components/layout/Loader.jsx'


// See the return statement to understand how Chat is getting called and chatId is comming
const Chat = ({chatId,user}) => {
  const containerRef=useRef(null)
  // const fileMenuRef=useRef(null)
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null)
  const [page,setPage]=useState(1)
  const [IamTyping,setIamTyping]=useState(false)
  const [userTyping,setUserTyping]=useState(false)
  const typingTimeOut=useRef(null)
  const socket=getSocket()
  const dispatch=useDispatch()
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})  // only call when chatId is there
  const oldMessagesChunk=useGetMessagesQuery({chatId,page})
  const members=chatDetails?.data?.chat?.members
  const bottomRef=useRef(null)

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true))
    setFileMenuAnchor(e.currentTarget)
  }
  // console.log(chatDetails?.data?.chat)

  // see Note.txt-> NOTE2 to understand how useInfinteScrollTop may work internally
  // renaming data and setData
  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(containerRef,oldMessagesChunk.data?.totalPages,page,setPage,oldMessagesChunk.data?.message)
  const errors=[
    {isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ]
  // console.log("oldmessages",oldMessages)
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
    dispatch(removeNewMessagesAlert(chatId))
    // when the chatId changes it trigger the useEffect and before the useEffect do its work the return statement is executed
    return()=>{
      setMessages([])
      setMessage("")
      setPage(1)
      setOldMessages([])
    }
  },[chatId])
  
  const messageOnChange=(e)=>{
    setMessage(e.target.value)
    if(!IamTyping)
    {
      socket.emit(START_TYPING,{members,chatId})
      setIamTyping(true)
    }
    if(typingTimeOut.current) clearTimeout(typingTimeOut.current)

    typingTimeOut.current=setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId})
      setIamTyping(false)
    },[2000])
  }

  useEffect(()=>{
    if(bottomRef.current)
      bottomRef.current.scrollIntoView({behavior:"smooth"})
  },[messages])

  const newMessagesListner=useCallback((data)=>{
    //  console.log(data)  
     if(data.chatId !== chatId) return
    setMessages(prev=>[...prev,data.message])
  },[chatId])

  const startTypingListner=useCallback((data)=>{
    // console.log(data)  
    // console.log("START Typing ",data)
    if(data.chatId !== chatId) return
    setUserTyping(true)
  },[chatId])

  const stopTypingListner=useCallback((data)=>{
    if(data.chatId!==chatId) return;
      setUserTyping(false)
    // console.log("Stopping ",data)
  },[chatId])
  
  // [NEW_MESSAGE] is a dynammic variable, writting in this way means {'NEW_MESSAGE':newMessageHandler}
  const eventHandlerArr={
    [NEW_MESSAGE]:newMessagesListner,
    [START_TYPING]:startTypingListner,
    [STOP_TYPING]:stopTypingListner
  }   
  
  // custom hook
  useSocketEvents(socket,eventHandlerArr)
  useErrors(errors) 
  const allMessages=[...oldMessages,...messages]
  
  // console.log("User is Typing ",userTyping)
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
        {userTyping && <TypingLoader/>}
        
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
          <InputBox placeholder='Type Message here' value={message} onChange={e=>messageOnChange(e)}/>
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