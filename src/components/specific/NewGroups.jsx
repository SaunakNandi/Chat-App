import React, { useRef, useState } from 'react'
import { Dialog,Stack,DialogTitle, TextField, Typography, Button, Skeleton, Avatar, IconButton } from '@mui/material'
import UserItem from '../shared/UserItem'
import { useFileHandler, useInputValidation } from '6pp'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../styles/StyledComponent'
const NewGroups = () => {
  const dispatch=useDispatch()
  const {isNewGroup}=useSelector(state=>state.misc)
  const groupName=useInputValidation('')
  const [avatar,setAvatar]=useState({preview:'',file:''})
  const [selectedMembers,setSelectedMembers]=useState([])
  const {isError,isLoading,data,error}=useAvailableFriendsQuery()
  const [newGroup,isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation)
  const bioRef=useRef(null)
  const errors=[
    {
      isError,
      error
    }
  ]
  const selectMemberHandler=(id)=>{
    // console.log(id)
    // setMembers(prev=>prev.map(user=>user._id===id? {...user,isAdded:!user.isAdded}:user))
    setSelectedMembers(prev=> prev.includes(id)? prev.filter((curr)=>curr!==id):[...prev,id])
  }

  function cancelRequestHandler(_id){
    selectMemberHandler(prev=>prev.filter(id=>id!=_id))
  }

  const submitHandler=()=>{
    if(!groupName.value) return toast.error('Group name is required')
    if(selectedMembers.length<2) return toast.error('Please select ateast 2 members')
    
    const formData=new FormData()
    formData.append('name',groupName.value)
    formData.append('members',JSON.stringify(selectedMembers))
    if (avatar?.file)
      formData.append('avatar',avatar.file)
    formData.append('bio',bioRef.current.value)
  // console.log(groupName.value,selectedMembers,avatar.file,bioRef.current.value)
        // creating group
        newGroup("Creating New Group...",formData)
        closeHandler()
  }
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false))
  }

  function handleImageUpload(e)
  {
    const file=e.target.files[0]
    if(file)
    {
      const preview=URL.createObjectURL(file)
      setAvatar({preview,file})
    }
  } 
  useErrors(errors)
  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{xs:'1rem',sm:"2rem"}} maxWidth={'25rem'} width={'25rem'} spacing={'1rem'}>
        <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <Stack sx={{position:"relative",width:'10rem'}} margin={'auto'}>
            <Avatar sx={{width:'100%',height:'10rem',objectFit:'contain'}} src={avatar.preview}/>
            <IconButton sx={{position:'absolute',bottom:0,cursor:'pointer',right:0,color:'white',bgcolor:'rgba(0, 0, 0, 0.57)',
                        ":hover":{
                            bgcolor:'rgba(39, 39, 39, 0.1)'
                        }}} component="label">
              <CameraAlt></CameraAlt>
              <VisuallyHiddenInput type='file' onChange={handleImageUpload}/>
            </IconButton>
          </Stack>
        </div>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label='Group Name'/>
        <TextField required label="Bio" margin="normal" variant="outlined" fullWidth inputRef={bioRef}/>
        <Typography variant='body1'>Add Members</Typography>
        <Stack>
          {
            isLoading? <Skeleton/>:
            (
              data?.friends?.map((x) => (
              <UserItem user={x} key={x._id}
                handler={selectMemberHandler}  
                cancelRequestHandler={cancelRequestHandler}
                isAdded={selectedMembers.includes(x._id)}/>
            )))
          }
        </Stack>
        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <Button variant="outlined" color='error'  size="large" onClick={closeHandler}>Cancel</Button>
          <Button variant="contained" onClick={submitHandler} size="large" disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroups