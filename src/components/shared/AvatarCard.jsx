import { Avatar, Stack, Box } from '@mui/material'
import React from 'react'
import { transformImage } from '../lib/Feature'

const AvatarCard = ({avatar=[],max=4}) => {
  return (
    
    <Stack direction={"row"} spacing={0.5} >
        <Avatar max={max} sx={{position:"relative"}}>
            <Box width={"5rem"} height={"3rem"} bgcolor={'pink'}>
                <img key={Math.random()*100} alt={`Avatar`}
                    src={transformImage(avatar[0])}
                    style={{
                        width:"3rem",
                        height:"3rem",
                        position:"absolute",
                        left:{
                            xs:`${0.5}rem`,
                        }
                    }}/>
            </Box>
        </Avatar>
    </Stack>
  )
}

export default AvatarCard