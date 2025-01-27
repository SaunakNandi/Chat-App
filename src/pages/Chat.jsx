import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { gray, orange } from '../constants/Color'
import { IconButton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponent'
import { FileMenu } from '../components/FileMenu'
import { sampleMessages } from '../constants/sample_data'
import MessageComponent from '../components/shared/MessageComponent'

const Chat = () => {
  const containerRef=useRef(null)
  const fileMenuRef=useRef(null)

  // user is me
  const user={
    _id:'asfeffaa',
    name:'Daku Dhon'
  }
  return (
    <>
      <Stack ref={containerRef} boxSizing={'border-box'} padding={'1rem'} spacing={'1rem'} bgcolor={gray} height={'90%'} 
      sx={{
        overflowX:'hidden',
        overflowY:'auto',
      }}>
        {/* Messages */}
        {
          sampleMessages.map((msg)=>(
            <MessageComponent message={msg} user={user} key={msg._id}/>
          ))
        }
      </Stack>
      <form style={{ height:'10%'}}>
        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'}>
          <IconButton
          sx={{
            position:'absolute',
            left:'1.5rem',
            rotate:'30deg'
          }} >
            <AttachFileIcon/>
          </IconButton>
          <InputBox placeholder='Type Message here'/>
          <IconButton type='submit' sx={{
            backgroundColor:orange,
            color:'white',
            marginLeft:'1rem',
            padding:'0.5rem',
            "&:hover":{
              bgcolor:'error.dark'
            }
          }}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      {/* <FileMenu /> */}
    </>
  )
}

export default AppLayout()(Chat)