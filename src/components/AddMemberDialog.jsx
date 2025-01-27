import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sample_data'
import UserItem from './shared/UserItem'

const AddMemberDialog = ({addMember,isLoadingAddMember,chatId}) => {
    const [members,setMembers]=useState(sampleUsers)
    const [selectedMembers,setSelectedMembers]=useState([])
    const selectMemberHandler=(id)=>{
        setSelectedMembers(prev=> prev.includes(id)? prev.filter((curr)=>curr!==id):[...prev,id])
    }
    const addMemberSubmit=()=>{
        
    }
    const closeHandler=()=>{
        setMembers([])
        setSelectedMembers([])
    }
  return (
    <Dialog open onClose={closeHandler}>
        <Stack p={'2rem'} width={'20rem'} spacing={'2rem'}>
            <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
            <Stack spacing={'1rem'}>
                {
                    members.length>0?(
                        members.map(x=>(
                            <UserItem user={x} key={x._id} handler={()=>selectMemberHandler(x._id)}
                            isAdded={
                                selectedMembers.includes(x._id)
                            }/>
                        ))
                    ):<Typography textAlign={'center'}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Button color='error' onClick={closeHandler}>Cancle</Button>
                <Button color='contained' onClick={addMemberSubmit} disabled={isLoadingAddMember}>Submit Changes</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog