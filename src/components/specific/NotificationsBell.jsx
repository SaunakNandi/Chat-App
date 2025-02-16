import { Dialog, DialogTitle, ListItem, Stack, Typography, Avatar, Button, Skeleton } from '@mui/material'
import React, { memo } from 'react'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
const NotificationsBell = () => {

  // data will get this from server json({success:true,request:all_requests})
  const {isLoading,data,error,isError}=useGetNotificationsQuery()
  const [acceptRequest]=useAcceptFriendRequestMutation()
  const {isNotification}=useSelector(state=>state.misc)
  const dispatch = useDispatch()

  // this can be put in hook.js also like useAsyncMutation(useSendFriendRequestMutation)
  async function frndReqHandler({_id,accept}){
    try {
      // after accept request that perticular notification will get deleted because in server we have done 
      // request.deleteOne()
      const res=await acceptRequest({requestId:_id,accept})
      if(res.data?.success)
      {
        toast.success(res.data.message)

      }
      else{
        console.error(error)
        toast.error(error || "Notification not found")
      }
    } catch (error) {
      console.error(error)
    }
  }
  const closeHandler=()=>{
    dispatch(setIsNotification(false))
  }
  useErrors([{error,isError}])
  console.log(data)
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
                      sender={notification.sender} handler={frndReqHandler} />
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
