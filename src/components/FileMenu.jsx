import { IconButton, ListItemText, Menu, MenuItem, MenuList, Stack, Tooltip, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../redux/reducers/misc'
import { AttachFile as AttachFileIcon, AudioFile as AudioFileIcon, Close as CloseIcon, Image as ImageIcon, Send as SendIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../redux/api/api'
import ReactDOM from 'react-dom'
import { useParams } from 'react-router-dom'

function PopModel({setIsPopupModel}){
  const dispatch=useDispatch()
  const [menuOpen,setMenuOpen]=useState(false)
  const [sendAttachments]=useSendAttachmentsMutation()
  const {chatId}=useParams()
  const [selectedFile,setSelectedFile]=useState([])
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null)
  
  const imageiRef = useRef();
  const audioiRef = useRef();
  const videoiRef = useRef();
  const fileiRef = useRef();
  const selectRef=(ref)=>{
    ref.current?.click()
  }
  dispatch(setIsFileMenu(false))
  function onClose()
  {
    setIsPopupModel(false)
  }
  function generateRandom()
  { 
    return Math.floor((Math.random()*1000)+1)
  }

  function handleSelctedFiles(e)
  {
    const filesWithIds = Array.from(e.target.files).map(file => ({
      id: generateRandom(),
      file
    }));
    console.log(filesWithIds)
    setSelectedFile(prev => [...prev, ...filesWithIds]);
  }

  function removeFile(id)
  {
    const files=[...selectedFile]
    console.log("removeFile called",files)
    const remainingFiles=files.filter(item=>item.id!=id)
    setSelectedFile(remainingFiles)
  }
  function handleFileOpen(e)
  {
    setMenuOpen(true)
    setFileMenuAnchor(e.currentTarget)
  }

  function onInputChange(e){
    handleSelctedFiles(e);
    setMenuOpen(false)
  }
  async function fileChangeHandler()
  {
    // console.log("selectedFile ",selectedFile)
    if(selectedFile.length>5) return toast.error('You can only send 5 items');
    onClose()
    const fileArr=selectedFile.map(file=>{ return (file.file)})
    console.log("Files array ",fileArr)
    dispatch(setUploadingLoader(true))
    const toastId=toast.loading('Sending...')
    try {
      const formData=new FormData()
      formData.append("chatId",chatId)
      fileArr.forEach((file)=>formData.append("files",file))
      // console.log("formData",formData)
      const response=await sendAttachments(formData)
      // console.log("response ",response)
      if(!response.ok) toast.error('Error sending files ',{id:toastId})
      } 
      catch (error) {
        console.log("PopModel error ",error)
      }
  finally{
      toast.dismiss(toastId)
      dispatch(setUploadingLoader(false))
    }
  }
  return ReactDOM.createPortal(
    <div className="modal-overlay" style={{position: 'fixed',top: '30%',left: '30%',right:'30%',width: '60vw',height: '40vh',
    backgroundColor:'lightblue',zIndex: 1000}} 
    onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} 
      style={{padding: '2rem',borderRadius: '8px',position: 'relative',top:0}}>
        <button style={{position: 'absolute',top: '20px',right: '20px',border: 'none',fontSize: '1.5rem',cursor: 'pointer'}} 
        onClick={onClose}>X</button>
        {
          selectedFile.length>0 && (
          <div style={{width:'54vw',height:'20vh',backgroundColor:'lightgreen',display:'flex',padding:'1vw',justifyContent:'space-evenly',flexWrap:'wrap'}}>
            {
              selectedFile.map((file,i)=>{
                return (
                  <div style={{width:'12vw',height:"12vh",border:'1px solid white',display:'flex',justifyContent:'space-between',alignItems:'start',padding:'10px'}} key={i}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'8vw'}}>
                      <IconButton sx={{width:'50px',height:"50px",border:'1px solid black',marginTop:'10px'}}>
                        {file.file.type.split('/')[0]=='image' && <ImageIcon fontSize='large'/>}
                        {file.file.type.split('/')[0]=='audio' && <AudioFileIcon fontSize='large'/>}
                        {file.file.type.split('/')[0]=="video" && <VideoFileIcon fontSize='large'/>}
                        {!['image', 'audio', 'video'].includes(file.file.type.split('/')[0]) && <UploadFileIcon fontSize="large" />}
                      </IconButton>
                      <Typography sx={{whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',textAlign: 'center',width:'100%'}}>
                        {file.file.name}
                      </Typography>
                    </div>
                    <IconButton onClick={()=>removeFile(file.id)}>
                      <CloseIcon fontSize='medium' sx={{color:'red'}}/>
                    </IconButton>
                  </div>
                )}
              )
            }
            
          </div>
          )
        }
        {/* <p style={{color:'black'}}>Hello</p> */}
        <h3>Select files</h3>
        <Menu anchorEl={fileMenuAnchor} open={menuOpen} onClose={()=>setMenuOpen(false)}>
          <MenuList>
            <MenuItem onClick={()=>selectRef(imageiRef)}>
              <Tooltip>
                <ImageIcon/>
              </Tooltip>
              <ListItemText>Image</ListItemText>
              <input type='file' ref={imageiRef} accept='image/*'
              onChange={(e)=>onInputChange(e)}
              style={{ display: 'none' }}/>
            </MenuItem>
            <MenuItem onClick={()=>selectRef(audioiRef)}>
              <Tooltip>
                <AudioFileIcon/>
              </Tooltip>
              <ListItemText>Audio</ListItemText>
              <input type='file' ref={fileiRef} accept='auido/*'
              onChange={(e)=>onInputChange(e)}
              style={{ display: 'none' }}/>
            </MenuItem>
            <MenuItem onClick={()=>selectRef(videoiRef)}>
              <Tooltip>
                <VideoFileIcon/>
              </Tooltip>
              <ListItemText>Video</ListItemText>
              <input type='file' ref={videoiRef} accept='video/*'
              onChange={(e)=>onInputChange(e)}
              style={{ display: 'none' }}/>
            </MenuItem>
            <MenuItem onClick={()=>selectRef(fileiRef)}>
              <Tooltip>
                <UploadFileIcon/>
              </Tooltip>
              <ListItemText>File</ListItemText>
              <input type='file' ref={fileiRef} accept='*'
              onChange={(e)=>onInputChange(e)}
              style={{ display: 'none' }}/>
            </MenuItem>
          </MenuList>
        </Menu>
        <div>
          <Stack>
            <IconButton onClick={handleFileOpen}
              sx={{
                position:'absolute',
                left:'1.5rem',
                rotate:'30deg'
              }} >
                <AttachFileIcon/>
            </IconButton>
            <IconButton type='submit' 
            sx={{backgroundColor: 'orange',color: 'white',marginLeft: '1rem',
              position:'absolute',
                left:'3rem',
              "&:hover": {
                bgcolor: 'error.dark'
              }
            }} onClick={fileChangeHandler}>
              <SendIcon />
            </IconButton>
          </Stack>
        </div>
      </div>
    </div>,
    document.body
  );
}



export const FileMenu = ({isPopupModel,setIsPopupModel}) => {
  
  const dispatch=useDispatch()
  const [sendAttachments]=useSendAttachmentsMutation()
  const fileChangeHandler=async(e,key)=>{
   
    // const files=Array.from(e.target.files)
    // console.log("Files ",files)
    // if(files.length<=0) return
    // if(files.length>5) return toast.error(`You can only send 5 ${key} at a time`)
    // dispatch(setUploadingLoader(true))
    // const toastId=toast.loading(`Sending ${key}...`)
    // closeFileMenu()
    // try {
    //   const myForm=new FormData()
    //   myForm.append("chatId",chatId)
    //   files.forEach((file)=>myForm.append("files",file))

    //   const response=await sendAttachments(myForm)
    //   console.log("fileChangeHandler",response)
    //   if(response.data)
    //   {
    //     toast.success(`${key} send successfully`,{id:toastId})
    //   }
    //   else toast.error(`Failed to send ${key}`,{id:toastId})
    // } 
    // catch (error) {
    //   toast.error(error,{id:toastId})
    // }
    // finally{
    //   dispatch(setUploadingLoader(false))
    // }
  }
  return (
    <>
      {
        isPopupModel && <PopModel setIsPopupModel={setIsPopupModel}/>
      }
    </>
  )
}
