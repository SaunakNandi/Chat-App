import React from 'react'
import { transformImage } from '../lib/Feature';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

export const RenderAttachments = (file,url) => {
    // console.log(file,url)
    switch(file){
        case "video":
            return <video src={url} preload='none' width={'200px'} controls></video>
        case "image":
            return <img src={transformImage(url,200)} alt='attachments' width={'200px'} height={'150px'}
            style={{
                objectFit: 'contain'
            }}/>
        case "audio":
            return <audio src={url} preload="home" controls/>
        default: return <FileOpenIcon/>
    }
}
