import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../lib/Feature'
const Profile = ({user}) => {
  return (
    <Stack spacing={'2rem'} direction={'column'} alignItems={"center"}>
      <Avatar sx={{
        width: 200,
        height: 200,
        border: '2px solid #000',
        objectFit:'contain',
        marginBottom:'1rem'
      }}
      src={transformImage(user?.avatar?.url)}/>
      <ProfileCard heading={'Bio'} text={user?.bio}/>
      <ProfileCard heading={'Username'} text={user?.username} Icon={<UsernameIcon/>}/>
      <ProfileCard heading={'Joined'} text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon/>}/>
      <ProfileCard heading={'Name'} text={user?.name} Icon={<FaceIcon/>}/>
    </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=>{
  return (
    <Stack spacing={'1rem'} color={'white'} textAlign={'center'} direction={'row'} alignItems={'center'}>
      {Icon && Icon} {/* if exists then show */}
      <Stack>
      <Typography variant='body1'>{text}</Typography>
      <Typography variant='caption' color={'gray'}>{heading}</Typography>
      </Stack>
    </Stack>
  )

}
export default Profile