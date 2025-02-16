import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import UserItem from './shared/UserItem'
import { useDispatch,useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'

const AddMemberDialog = ({chatId}) => {
    const [selectedMembers,setSelectedMembers]=useState([])
    const [addMembers,isLoadingAddMembers]=useAsyncMutation(useAddGroupMemberMutation)
    const {isLoading,data,isError,error}=useAvailableFriendsQuery(chatId)
    const {isAddMember}=useSelector(state=>state.misc)
    const dispatch=useDispatch()
    const selectMemberHandler=(id)=>{
        setSelectedMembers(prev=> prev.includes(id)? prev.filter((curr)=>curr!==id):[...prev,id])
    }
    const addMemberSubmit=()=>{
        addMembers("Adding Members...",{members:selectedMembers,chatId})
        closeHandler()
    }
    const closeHandler=()=>{
        dispatch(setIsAddMember(false))
    }
    useErrors([{isError,error}])
    console.log(data)
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={'2rem'} width={'20rem'} spacing={'2rem'}>
            <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
            <Stack spacing={'1rem'}>
                {
                    isLoading? (<Skeleton/>):
                    data.availableFriends?.length>0?(
                        data.availableFriends?.map(x=>(
                            <UserItem user={x} key={x._id} handler={()=>selectMemberHandler(x._id)}
                            isAdded={
                                selectedMembers.includes(x._id)
                            }/>
                        ))
                    ):<Typography textAlign={'center'}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Button color='error' onClick={closeHandler}>Cancel</Button>
                <Button color='contained' onClick={addMemberSubmit} disabled={isLoadingAddMembers}>Submit Changes</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog