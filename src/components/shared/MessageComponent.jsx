import { Box, Typography } from '@mui/material'
import React, { memo } from 'react'
import { cyan } from '../../constants/Color'
import moment from 'moment'
import { fileFormat } from '../lib/Feature'
import { RenderAttachments } from '../specific/RenderAttachments'
import {motion} from 'framer-motion'

const MessageComponent = ({message,user}) => {
  const {sender,content,attachments=[],createdAt} =message
  const sameSender=sender?._id===user?._id
  const timeago=moment(createdAt).fromNow()
  return (
    <motion.div 
    initial={{opacity:0,x:"-100%"}}
    whileInView={{opacity:1,x:0}}
    style={{
      alignSelf:sameSender?"flex-end":'flex-start',
      color:'black',
      backgroundColor:'white',
      borderRadius:'5px',
      padding:'0.5rem',
      width:'fit-content',
    }}>
      {
        !sameSender && <Typography color={cyan} fontWeight={'600'}
        variant='caption'>{sender.name}</Typography>
      }
      {
        content && <Typography>{content}</Typography>
      }

      {/* Attachment */}
      {
        attachments.length>0 && (
          attachments.map((data,index)=>{
            const url=data.url
            const file=fileFormat(url)
            return (
              <Box key={index}>
                <a href={url} target='_blank' download 
                style={{
                  color:'black',
                }}>
                  {RenderAttachments(file,url)}
                </a>
              </Box>
            )
          })
        )
      }
      <Typography variant='caption' color={'text.secondary'}>{timeago}</Typography>
    </motion.div>
  )
}

export default memo(MessageComponent)