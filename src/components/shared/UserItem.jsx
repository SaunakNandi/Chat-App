import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import { transformImage } from '../lib/Feature'

const UserItem = ({user,handler,handlerIsLoading,cancelRequestHandler, isAdded=false, styling={}}) => {
    const {name,_id,avatar}=user
    const [added,setAdded]=useState(isAdded)
    function handlerFunc()
    {
        if(!added) handler(_id)
        else cancelRequestHandler(_id)
        setAdded(prev=>!prev)    
    }
  return (
    <ListItem >
        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'} {...styling}>
            <Avatar src={transformImage(avatar)}/>

            <Typography variant='body1'
            sx={{
                flexGrow:1,
                display:"-webkit-box",
                WebkitLineClamp:1,
                WebkitBoxOrient:"vertical",
                overflow:"hidden",
                textOverflow:"ellipsis",
                width:"100%",
            }}>{name}</Typography>
            <IconButton onClick={handlerFunc} disabled={handlerIsLoading}
                size="small"
                sx={{
                    bgcolor: added? "error.main":"primary.main",
                    color: 'white',
                    '&:hover':{
                        bgcolor:added? "error.dark":"primary.dark"
                    }
                }}>
                    {
                        added? <RemoveIcon></RemoveIcon>:<AddIcon></AddIcon>
                    }
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)