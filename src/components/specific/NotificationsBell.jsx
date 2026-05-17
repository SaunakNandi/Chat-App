/* eslint-disable react/display-name */
import { Dialog, DialogTitle, ListItem, Stack, Typography, Avatar, Button, Skeleton } from '@mui/material'
import { memo, useEffect } from 'react'
import { useAcceptFriendRequestMutation, useClearNotificationMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
const NotificationsBell = () => {

  // data will get this from server json({success:true,request:all_requests})
  const {isLoading,data,error,isError}=useGetNotificationsQuery()
  const [acceptRequest]=useAsyncMutation(useAcceptFriendRequestMutation)
  const [clearNotification]=useAsyncMutation(useClearNotificationMutation)
  const {isNotification}=useSelector(state=>state.misc)
  const dispatch = useDispatch()
  // this can be put in hook.js also like useAsyncMutation(useSendFriendRequestMutation)
  async function frndReqHandler({_id,accept}){
    dispatch(setIsNotification(false))
    await acceptRequest("Accepting... ",{requestId:_id,accept})
  }
  const closeHandler=()=>{
    dispatch(setIsNotification(false))
  }

  const dismissHandler=async(id)=>{
    await clearNotification("clear notifications ",id) // notification id
  }

  useErrors([{error,isError}])
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs:'1rem',sm:"2rem"}} maxWidth={'25rem'}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading? <Skeleton/>:(
            <>
              {
                data?.request.length > 0 ? (
                  data.request?.map(notification => (
                    <NotificationItem key={notification._id} _id={notification._id}
                      notify={notification} handler={frndReqHandler} onDismiss={()=>dismissHandler(notification._id)}/>
                  ))
                ) : (
                  <Typography textAlign={'center'}>0 Notifications</Typography>
                )
              }
            </>
          )
        }
      </Stack>
    </Dialog>
  )
}
// NotificationItem shouldn't get re-rendered until and unless its props changes
const NotificationItem=memo(
  ({notify,_id,handler,onDismiss})=>{
    const {sender,message,type}=notify
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
              {
                type==="FRIEND_REQUEST"? `${name} sent you a friend request`:message
              }
            </Typography>
            { type === "FRIEND_REQUEST" ? (
              <Stack direction={{ xs: 'column', sm: 'row' }}>
                <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
                <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
              </Stack>
            ) : (
              /* If group alert, render a clean Dismiss toggle action */
              <Button size="small" color="secondary" onClick={() => onDismiss(_id)}>
                Dismiss
              </Button>
            )}
        </Stack>
      </ListItem>
    )
  }
)

export default NotificationsBell
