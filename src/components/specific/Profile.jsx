import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { IconBtn } from '../shared/IconBtn'
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
const Profile = () => {
  return (
    <Stack spacing={'2rem'} direction={'column'} alignItems={"center"}>
      <Avatar sx={{
        width: 200,
        height: 200,
        border: '2px solid #000',
        objectFit:'contain',
        marginBottom:'1rem'
      }}/>
      <ProfileCard heading={'Bio'} text={'ahfwegfhkf yha va'}/>
      <ProfileCard heading={'Username'} text={'ahfwegfhkf yha va'} Icon={<UsernameIcon/>}/>
      <ProfileCard heading={'Joined'} text={moment('2023-11-04T18:30:00.000Z').fromNow()} Icon={<CalendarIcon/>}/>
      <ProfileCard heading={'Name'} text={'My name is'} Icon={<FaceIcon/>}/>
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