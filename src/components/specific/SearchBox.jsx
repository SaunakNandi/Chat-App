import { Dialog, DialogTitle, Stack,InputAdornment, TextField, List, ListItem } from '@mui/material'
import React, { useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../../constants/sample_data'
const SearchBox = () => {
  const search = useInputValidation('')
  const addFriendHandler=()=>{

  }
  let isLoadingSendFriendReq=false
  const [users,setUsers]=useState(sampleUsers)
  return (
    <Dialog open>
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
          {
            users.map((x)=>(
              <UserItem user={x} key={x._id} 
              handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendReq}/>
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default SearchBox