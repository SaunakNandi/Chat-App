import { Avatar, Stack, Typography } from '@mui/material'
import { Face as FaceIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../lib/Feature'
import { useFriendsDetailsQuery } from '../../redux/api/api'
const Profile = ({friendsID}) => {
  
  const friendsDetails=useFriendsDetailsQuery(friendsID)
  return friendsDetails?.data &&(
    <Stack spacing={'2rem'} direction={'column'} alignItems={"center"}>
      <Avatar sx={{
        width: 200,
        height: 200,
        border: '2px solid #000',
        objectFit:'contain',
        marginBottom:'1rem'
      }}
      src={transformImage(friendsDetails.data?.friendsData?.avatar?.url)}/>
      <ProfileCard heading={'Bio'} text={friendsDetails.data.friendsData?.bio}/>
      <ProfileCard heading={'Joined'} text={moment(friendsDetails.data.friendsData?.createdAt).fromNow()} Icon={<CalendarIcon/>}/>
      <ProfileCard heading={'Name'} text={friendsDetails.data.friendsData?.name} Icon={<FaceIcon/>}/>
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