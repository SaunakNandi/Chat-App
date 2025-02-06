import React, { useEffect } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import Grid from '@mui/material/Grid2'
import ChatList from '../specific/ChatList'
// import { samplechats } from '../../constants/sample_data'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'
import { useErrors } from '../../hooks/hook'

// HOC
const AppLayout = () =>(WrappedComponent)=> {
  return (props)=>{

    const params=useParams()
    const chatId=params.chatId
    const dispatch=useDispatch()
    // useMyChatsQuery returns an object that includes data.
    // {
    //     data,         // The fetched chat data (or undefined if still loading)
    //     isLoading,    // Boolean: true while fetching
    //     error,        // Contains error details if the request fails
    //     refetch       // Function to manually refetch data
    //   }
    const {isLoading,data,isError,error,refetch}=useMyChatsQuery("")
    console.log(data)
    
    useErrors([{error,isError}])
    const {isMobile}=useSelector((state)=>state.misc)
    const {user}=useSelector((state)=>state.auth)
    const handleMobileClose=()=>{
        dispatch(setIsMobile(false))
    }
    const handleDeleteChat=(e,_id,groupChat)=>{
        e.preventDefault()
        console.log("Deleting chat", _id)
    }
    return(
        <>
            <Title/>
            <Header/>

            {
                isLoading?<Skeleton/>:(
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList w="70vw" chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>
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
                        (<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}/>)
                    }
                </Grid>

                <Grid item size={{ xs: 12, sm:8 ,md: 5, lg:6  }} sx={{
                        height: "100%",
                        bgcolor: "aliceblue",
                    }}
                >
                    <WrappedComponent {...props} />
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