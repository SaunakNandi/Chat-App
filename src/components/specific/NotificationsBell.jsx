import { Dialog, DialogTitle, ListItem, Stack, Typography, Avatar, Button } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/sample_data'

const NotificationsBell = () => {
  function frndReqHandler({_id,accept}){
    console.log('Hello')
  }
  return (
    <Dialog open>
      <Stack p={{xs:'1rem',sm:"2rem"}} maxWidth={'25rem'}>
        <DialogTitle>Notifications</DialogTitle>
        {
          sampleNotifications.length>0? (
            sampleNotifications.map(notification=>(
              <NotificationItem key={notification._id} _id={notification._id}
              sender={notification.sender} handler={frndReqHandler}/>
            ))
          ):(
            <Typography textAlign={'center'}>0 Notifications</Typography>
          )
        }
      </Stack>
    </Dialog>
  )
}
// NotificationItem shouldn't get re-rendered until and unless its props changes
const NotificationItem=memo(
  ({sender,_id,handler})=>{
    const {name,avatar} = sender
    return (
      <ListItem >
        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
            <Avatar src={avatar}/>

            <Typography variant='body1'
            sx={{
                flexGrow:1,
                display:"-webkit-box",
                WebkitLineClamp:1,
                WebkitBoxOrient:"vertical",
                overflow:"hidden",
                textOverflow:"ellipsis",
                width:"100%",
            }}>
              {`${name} sent you a friend request`}
            </Typography>
            <Stack direction={{
              xs:'column',
              sm:'row'
            }}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button>
            </Stack>
        </Stack>
      </ListItem>
    )
  }
)

export default NotificationsBell
