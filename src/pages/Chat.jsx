import React, { useCallback, useRef, useState,useEffect } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { gray, orange } from '../constants/Color'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponent'
import { FileMenu } from '../components/FileMenu'
import MessageComponent from '../components/shared/MessageComponent'
import { getSocket } from '../socket'
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js'
import { useErrors, useSocketEvents } from '../hooks/hook.jsx'
import { useInfiniteScrollTop } from '6pp'
import { setIsFileMenu } from '../redux/reducers/misc.js'
import { removeNewMessagesAlert } from '../redux/reducers/chat.js'
import { TypingLoader } from '../components/layout/Loader.jsx'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

// See the return statement to understand how Chat is getting called and chatId is comming
const Chat = ({chatId,user}) => {
  const containerRef=useRef(null)
  const dispatch=useDispatch()
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null)
  const [page,setPage]=useState(1)
  const [IamTyping,setIamTyping]=useState(false)
  const [userTyping,setUserTyping]=useState(false)
  const typingTimeOut=useRef(null)
  const navigate=useNavigate()
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId})  // only call when chatId is there
  const oldMessagesChunk=useGetMessagesQuery({chatId,page})
  const members=chatDetails?.data?.chat?.members
  const socket=getSocket()
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
    
    // NOTE 3 - Why NEW_MESSAGE is listned in server but not in client when emitted from here
    // Emitting message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message})

    // When you send the message the scrollbar should comedown
    if(bottomRef.current)
      bottomRef.current.scrollIntoView({behavior:"smooth"})
    setMessage("")
  }

  useEffect(()=>{
    // console.log("userId ",user._id)
    // console.log("members ",members)
    socket.emit(CHAT_JOINED,{userId:user._id,members,chatId})
    dispatch(removeNewMessagesAlert(chatId))
    console.log("ChatId ",chatId)
    // when the chatId changes it trigger the useEffect and before the useEffect do its work the return statement is executed
    return()=>{
      setMessages([])
      setMessage("")
      setPage(1)
      setOldMessages([])
      socket.emit(CHAT_LEAVED,{userId:user._id,members,chatId})
    }
  },[chatId,members])
  
  // if you are not a part of the group you are trying to look
  useEffect(()=>{
    console.log("Chat Details ",chatDetails)
    if(chatDetails.isError) return navigate('/')
  },[chatDetails.isError])

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
  
  const alertListner=useCallback((data)=>{
    console.log("alertListner ",data)
    if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
  },[chatId])
  // [NEW_MESSAGE] is a dynammic variable, writting in this way means {'NEW_MESSAGE':newMessageHandler}
  const eventHandlerArr={
    [ALERT]:alertListner,
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
        {userTyping && <TypingLoader ref={bottomRef}/>}

        {/* Scroll bar should come down when you have sent a message */}
        <div ref={bottomRef}></div>
        
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