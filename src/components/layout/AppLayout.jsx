import React from 'react'
import Header from './Header'
import Title from '../shared/Title'
import Grid from '@mui/material/Grid2'
import ChatList from '../specific/ChatList'
// import { samplechats } from '../../constants/sample_data'
import { useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { Skeleton } from '@mui/material'

// HOC
const AppLayout = () =>(WrappedComponent)=> {
  return (props)=>{

    const params=useParams()
    const chatId=params.chatId
    const {isLoading,data,isError,error,refetch}=useMyChatsQuery("")
    console.log(data)
    const handleDeleteChat=(e,_id,groupChat)=>{
        e.preventDefault()
        console.log("Deleting chat", _id)
    }
    return(
        <>
            <Title/>
            <Header/>
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
                        (<ChatList chats={data?.chats} chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            onlineUsers={["1","2"]}/>
                        )
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
                    <Profile/>
                </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout