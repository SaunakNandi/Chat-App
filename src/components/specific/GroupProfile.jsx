import React from 'react'
import { useGroupDetailsQuery } from '../../redux/api/api'
import { Avatar, Stack, Typography } from '@mui/material'
import moment from 'moment'

const GroupProfile = ({chatId}) => {
    // console.log("GroupProfile",chatId)
    const response=useGroupDetailsQuery(chatId)
    const data=response?.data?.details
    console.log("Response data for group ", response?.data?.details)
  return data && (
    <Stack spacing={'1.5rem'} direction={'column'} alignItems={'center'}>
        {data?.avatar && <Avatar src={data.avatar.url} sx={{width:200,height:200,border:'2px solid #000'}}/>}
        <Stack spacing={'1rem'} textAlign={'center'} color={'white'}>
            <Typography variant='body1' sx={{fontSize:'18px',fontWeight:600}}>Name</Typography>
            <Typography variant='caption' sx={{fontSize:'16px'}}>{data.name}</Typography>
        </Stack>
        <Stack spacing={'1rem'} textAlign={'center'} color={'white'}>
            <Typography variant='body1' sx={{fontSize:'18px',fontWeight:600}}>Bio</Typography>
            <Typography variant='caption' sx={{fontSize:'16px'}}>{data.bio}</Typography>
        </Stack>
        <Stack spacing={'1rem'} textAlign={'center'} color={'white'}>
            <Typography variant='body1' sx={{fontSize:'18px',fontWeight:600}}>Created on</Typography>
            <Typography variant='caption' sx={{fontSize:'16px'}}>{moment(data.createdAt).fromNow()}</Typography>
        </Stack>
        <Stack sx={{width:'18vw',height:'32vh',padding:'10px',overflowY:'auto',marginTop:'3vh'}}>
            <Typography variant='body1' sx={{fontWeight:600,textAlign:'center',marginBottom:'1vh',color:'white'}}>Group Members</Typography>
            {
                data.members.map(item=>(
                    <Stack key={item._id} direction={'row'} alignItems={'center'} width={'100%'} spacing={'1rem'} marginTop={'10px'}>
                        <Avatar src={item.avatar?.url} sx={{width:50,height:50}}/>
                        <Typography sx={{flexGrow:1,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis",width:"100%",}}>{item.name}</Typography>
                    </Stack>
                ))
            }
        </Stack>
    </Stack>

  )
}

export default GroupProfile