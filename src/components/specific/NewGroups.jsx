import React, { useState } from 'react'
import { Dialog,Stack,DialogTitle, TextField, Typography, Button, Skeleton } from '@mui/material'
import { sampleUsers } from '../../constants/sample_data'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
const NewGroups = () => {
  const dispatch=useDispatch()
  const {isNewGroup}=useSelector(state=>state.misc)
  const groupName=useInputValidation('')
  const [members,setMembers]=useState(sampleUsers)
  const [selectedMembers,setSelectedMembers]=useState([])
  const {isError,isLoading,data,error}=useAvailableFriendsQuery()
  const [newGroup,isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation)
  const selectMemberHandler=(id)=>{
    // setMembers(prev=>prev.map(user=>user._id===id? {...user,isAdded:!user.isAdded}:user))
    setSelectedMembers(prev=> prev.includes(id)? prev.filter((curr)=>curr!==id):[...prev,id])
  }
  const errors=[
    {
      isError,
      error
    }
  ]
  useErrors(errors)
  const submitHandler=()=>{
    if(!groupName.value) return toast.error('Group name is required')
    if(selectedMembers.length<2) return toast.error('Please select ateast 2 members')

    // creating group
    newGroup("Creating New Group...",{name:groupName.value,members:selectedMembers})
    closeHandler()
  }
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false))
  }
  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{xs:'1rem',sm:"2rem"}} maxWidth={'25rem'} width={'25rem'} spacing={'2rem'}>
        <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label='Group Name'/>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {
            isLoading? <Skeleton/>:
            (
              data?.friends?.map((x) => (
              <UserItem user={x} key={x._id}
                handler={selectMemberHandler}  
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