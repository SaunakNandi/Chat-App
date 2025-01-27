import React, { useState } from 'react'
import { Dialog,Stack,DialogTitle, TextField, Typography, Button } from '@mui/material'
import { sampleUsers } from '../../constants/sample_data'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'
const NewGroups = () => {

  const groupName=useInputValidation('')
  const [members,setMembers]=useState(sampleUsers)
  const [selectedMembers,setSelectedMembers]=useState([])
  const selectMemberHandler=(id)=>{
    // setMembers(prev=>prev.map(user=>user._id===id? {...user,isAdded:!user.isAdded}:user))
    setSelectedMembers(prev=> prev.includes(id)? prev.filter((curr)=>curr!==id):[...prev,id])
  }
  
  console.log(selectedMembers)
  const submitHandler=()=>{}
  const closeHandler=()=>{}
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{xs:'1rem',sm:"2rem"}} maxWidth={'25rem'} width={'25rem'} spacing={'2rem'}>
        <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label='Group Name'/>
        <Typography variant='body1'>Members</Typography>
        <Stack>
          {
            members.map((x) => (
              <UserItem user={x} key={x._id}
                handler={selectMemberHandler}  
                isAdded={selectedMembers.includes(x._id)}/>
            ))
          }
        </Stack>
        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <Button variant="outlined" color='error' onClick={submitHandler}>Cancel</Button>
          <Button variant="contained" onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroups