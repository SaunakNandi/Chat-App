import React, { memo } from 'react'
import { Link } from '../styles/StyledComponent'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {motion} from 'framer-motion'

const ChatItem = ({avatar=[],name,_id,groupChat=false,
    sameSender,isOnline,newMessageAlert,handleDeleteChat}) => {
        // console.log(newMessageAlert)
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}
    sx={{
        padding:0
    }}>
        <motion.div 
        initial={{ opacity: 0,y:"-100%" }}
        whileInView={{ opacity: 1,y:0 }}
        transition={{delay:0.5}}
        style={{
            display: 'flex',
            gap:'1rem',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: sameSender? 'gray' : 'unset',
            color: sameSender? 'white' : 'unset',
            position: 'relative',
        }}>
            {/* Avatar Card */}
            <AvatarCard avatar={avatar}/>
            <Stack>
                <Typography>{name}</Typography>
                {newMessageAlert && (
                    <Typography>{newMessageAlert.count} New Message</Typography>
                )}
            </Stack>
            {
                isOnline && !groupChat && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '1rem',
                        background: 'green',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        transform: 'translateY(-50%)',
                    }}></Box>
                )
            }
        </motion.div>
    </Link>
  )
}

// since map will be used on ChatItem, I don't want it to be rendered until and unless the props changes
export default memo(ChatItem)