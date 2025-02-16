import React, { useCallback, useEffect } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import Grid from '@mui/material/Grid2'
import ChatList from '../specific/ChatList'
// import { samplechats } from '../../constants/sample_data'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'
import { useErrors } from '../../hooks/hook'
import { getSocket } from '../../socket'
import { NEW_REQUEST, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../../constants/events'
import { incrementNotifications, setNewMessagesAlert } from '../../redux/reducers/chat'
import { useSocketEvents } from '../../hooks/hook'
import { getOrSaveFromStorage } from '../lib/Feature.js'
// HOC
const AppLayout = () =>(WrappedComponent)=> {
  return (props)=>{
    const socket=getSocket()
    console.log(socket.id)
    const params=useParams()
    const chatId=params.chatId
    const dispatch=useDispatch()
    const {isMobile}=useSelector((state)=>state.misc)
    const {user}=useSelector((state)=>state.auth)
    const {newMessagesAlert}=useSelector((state)=>state.chat)
    const navigate=useNavigate()
    // useMyChatsQuery returns an object that includes data.
    // {
    //     data,         // The fetched chat data (or undefined if still loading)
    //     isLoading,    // Boolean: true while fetching
    //     error,        // Contains error details if the request fails
    //     refetch       // Function to manually refetch data
    //   }
    const {isLoading,data,isError,error,refetch}=useMyChatsQuery("")
    // console.log(data)
    useEffect(()=>{
        // when we loads the page, in the newMessagesAlert get reset =>{chatId: "", count: 0} and new message is not visible
        // to solve this we will store the newMessagesAlert in localStorage and change the initilization of newMessagesAlert in chat.js
        console.log(newMessagesAlert)
        getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])

    // console.log("newMessagesAlert ",newMessagesAlert)
    const handleMobileClose=()=>{
        dispatch(setIsMobile(false))
    }
    const handleDeleteChat=(e,_id,groupChat)=>{
        e.preventDefault()
        console.log("Deleting chat", _id)
    }
    const newMessageAlertHandler=useCallback((data)=>{
        console.log("Data ",data)
        if(data.chatId==chatId) return
        dispatch(setNewMessagesAlert(data))
    },[chatId])

    const newRequestListener =useCallback(()=>{
        console.log("New message")
        dispatch(incrementNotifications())
    },[dispatch])
    const refetchListener=useCallback((data)=>{
        console.log("Refetching")
        console.log(user._id.toString()==data.userId.toString())
        refetch()
        if(user._id.toString()==data.userId.toString()) navigate('/')
    },[refetch,navigate])
    const eventHandlers={
        [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
        [NEW_REQUEST]:newRequestListener, 
        [REFETCH_CHATS]:refetchListener 
    }   
      
    useSocketEvents(socket,eventHandlers)
    useErrors([{error,isError}])
    return(
        <>
            <Title/>

            {/* Navbar */}
            <Header/>
            {
                isLoading?<Skeleton/>:(
                    // Hamburger/Menubar icon
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList w="70vw" chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}
                        newMessagesAlert={newMessagesAlert}/>
                    </Drawer>
                )
            }

            <Grid container sx={{
                    height: "calc(100vh - 4rem)", // Use sx for styles
                }}
            >
                <Grid item size={{ xs: 0, md: 3 }} 
                    sx={{
                        height: "100%",
                        display: { xs: "none", sm: "block" },
                    }}>
                    {
                        isLoading? (<Skeleton/>):
                        (<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert}/>)
                    }
                </Grid>

                <Grid item size={{ xs: 12, sm:8 ,md: 5, lg:6  }} sx={{
                        height: "100%",
                        bgcolor: "aliceblue",
                    }}
                >
                    {/* Chat component can be accessed from this WrappedComponent */}
                    {console.log({...props})}
                    <WrappedComponent {...props} chatId={chatId} user={user}/>
                </Grid>

                <Grid item md={4} lg={3} size={{ md: 4, lg:3 }} sx={{
                        height: "100%",
                        display: { xs: "none", md: "block" },
                        padding: "2rem",
                        bgcolor: "rgba(90, 88, 88, 0.85)",
                    }}
                >
                    <Profile user={user}/>
                </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout