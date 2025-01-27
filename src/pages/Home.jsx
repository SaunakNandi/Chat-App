import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Typography, Box } from '@mui/material'
import { gray } from '../constants/Color'

const Home = () => {
  return (
    <Box bgcolor={gray} height={'100%'}>
      <Typography variant='h5' textAlign={'center'} p={'2rem'}>Select a friend to chat</Typography>
    </Box>
  )
}
// watch at 1:14:00
export default AppLayout()(Home)