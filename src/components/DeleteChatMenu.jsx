import { Menu, Stack } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { setIsDeletemenu } from '../redux/reducers/misc'

const DeleteChatMenu = ({dispatch,deleteMenuAnchor=true}) => {
    const {isDeleteMenu, selectedDeleteChat}=useSelector(state=>state.misc)
    console.log(isDeleteMenu)
    const closeHandler=()=>{
        dispatch(setIsDeletemenu(false))
    }
    const leaveGroup=()=>{}
    const deleteChat=()=>{}
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
            spacing={"0.5rem"}>
                {
                    selectedDeleteChat.groupChat? <>Leave Group</>:<>Delete Chat</>
                }
            </Stack>
    </Menu>
  )
}

export default DeleteChatMenu