import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeletemenu } from '../redux/reducers/misc'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../redux/api/api'


//  Bug- When someone left the group and the admin is in manage group and looking at the members of the that group then person should get removed from the manage list immediately.
const DeleteChatMenu = ({dispatch,deleteMenuAnchor=true}) => {
    const navigate=useNavigate()
    const {isDeleteMenu, selectedDeleteChat}=useSelector(state=>state.misc)
    const [deleteChat,_,deleteChatData]=useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,leaveGroupData]=useAsyncMutation(useLeaveGroupMutation)
    const closeHandler=()=>{
        dispatch(setIsDeletemenu(false))
        deleteMenuAnchor.current=null 
    }
    const isGroup=selectedDeleteChat.groupChat
    const leaveGroupHandler=()=>{
        closeHandler()
        console.log("Leaving Group...",selectedDeleteChat.chatId)
        leaveGroup("Leaving Group...",selectedDeleteChat.chatId)
    }
    const deleteChatHandler=()=>{
        closeHandler()
        deleteChat("Deleting Chat...",selectedDeleteChat.chatId)
    }

    useEffect(()=>{
        if(deleteChatData || leaveGroupData) navigate("/")
    },[deleteChatData,leaveGroupData])
  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor}
    anchorOrigin={{
        vertical:'bottom',
        horizontal:'right'
    }}
    transformOrigin={{
        vertical:'center',
        horizontal:'center'
    }}>
    
        <Stack sx={{
            width:"10rem",
            padding:"0.5rem",
            cursor:"pointer"
            }}
            direction={"row"}
            alignItems={"center"}
            spacing={"0.5rem"}
            onClick={isGroup?leaveGroupHandler:deleteChatHandler}>
                {
                    isGroup?(
                        <>
                            <ExitToAppIcon/>
                            <Typography>Leave Group</Typography>
                        </>
                    ):(
                        <>
                            <DeleteIcon />
                            <Typography>Delete Chat</Typography>
                        </>
                    )
                }
            </Stack>
    </Menu>
  )
}

export default DeleteChatMenu