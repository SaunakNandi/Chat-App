import { Dialog, DialogTitle, Stack,InputAdornment, TextField, List } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useCancelRequestMutation, useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import { useAsyncMutation } from '../../hooks/hook'
const SearchBox = () => {
  const search = useInputValidation('')
  const dispatch=useDispatch()
  const {isSearch}=useSelector((state)=>state.misc)
  const {user}=useSelector((state)=>state.auth)
  const [users,setUsers]=useState([])
  const [searchUser]=useLazySearchUserQuery()
  const [sendFrndReq,isLoadingSendFriendReq]=useAsyncMutation(useSendFriendRequestMutation)
  const [cancelFrndReq,isLoadingCancelFriendReq]=useAsyncMutation(useCancelRequestMutation)
  const addFriendHandler=async(id)=>{
    await sendFrndReq("Sending friend requst...",{userId:id})
  }
  const cancelRequestHandler=async(id)=>{
    await cancelFrndReq("Revoking your request...",{userId:id})
  }
  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false))
  }

  useEffect(()=>{
    const timeOutId=setTimeout(()=>{
      // RTK Query's lazy queries accept only one argument, not multiple positional arguments. So when you pass two arguments, only the first (search.value) is passed, and the second (user._id) is ignored
      searchUser({ name: search.value, id: user._id })
      .then(({data})=>{
        console.log(data)
        if(data)
          setUsers(data.users)
    }).catch((e)=>console.error(e))
    },400)
    return ()=>{
      clearTimeout(timeOutId)
    }
  },[search.value])

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={'2rem'} direction={'column'} width={'25rem'}>
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>
        <TextField label='' value={search.value} 
        onChange={search.changeHandler}
        variant="outlined" size='small'
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}/>
        <List>
          { users && 
            users.map((x)=>(
              <UserItem user={x} key={x._id} 
              handler={addFriendHandler} cancelRequestHandler={cancelRequestHandler} handlerIsLoading={isLoadingSendFriendReq}/>
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default SearchBox