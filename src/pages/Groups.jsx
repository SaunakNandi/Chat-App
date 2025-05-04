import React, { useState, memo, useEffect, lazy, Suspense } from 'react'
import Grid from '@mui/material/Grid2'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, X } from '@mui/icons-material'
import { Backdrop, Box, Button, CircularProgress, Drawer, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from '../components/styles/StyledComponent'
import AvatarCard from '../components/shared/AvatarCard'
import { samplechats, sampleUsers } from '../constants/sample_data'
import AddMemberDialog from '../components/AddMemberDialog'
import UserItem from '../components/shared/UserItem'
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { Loader } from '../components/layout/Loader'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'

const ConfirmDeleteDialog=lazy(()=>import('../components/ConfirmDeleteDialog'))
const Groups = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {isAddMember}=useSelector(state=>state.misc)
  const [updateGroup,isLoadingGroupName]=useAsyncMutation(useRenameGroupMutation)
  const [removeMembers,isLoadingRemoveMembers]=useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup,isLoadingDeleteGroup]=useAsyncMutation(useDeleteChatMutation) 
  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(true)
  const [isEdit,setIsEdit]=useState(false)
  const [confirmDeleteDialog,setConfirmDeleteDialog]=useState(false)
  const [groupName,setGroupName]=useState('Group Name')
  const [members,setMembers]=useState([])
  const [groupNameUpdatedValue,setGroupNameUpdatedValue]=useState('')
  const chatId=useSearchParams()[0].get('group')
  const myGroups=useMyGroupsQuery("")
  console.log(chatId)
  let groupDetails=useChatDetailsQuery({chatId,populate:true},{skip:!chatId}) // fetch only when chatId is there
  console.log(groupDetails?.data)
  
  const errors=[
    {
      isError:myGroups?.isError,
      error:myGroups?.error,
    },
    {
      isError:groupDetails?.isError,
      error:groupDetails?.error,
    }
  ]
  useErrors(errors)

  useEffect(()=>{
    if(groupDetails.data)
    {
      setGroupName(groupDetails.data.chat.name)
      setGroupNameUpdatedValue(groupDetails.data.chat.name)
      setMembers(groupDetails.data.chat.members)
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  },[groupDetails?.data])

  const handleMobile=()=>{
    setIsMobileMenuOpen(prev=>!prev)
  }
  const handleMobileClose=()=>{
    setIsMobileMenuOpen(false)
  }

  const updateGroupName=()=>{
    setIsEdit(false)
    console.log()
    updateGroup("Updating group name...",{chatId,name:groupNameUpdatedValue})
  }
  const openConfirmDelete=()=>{
    setConfirmDeleteDialog(true)
  }
  const openAddMember=()=>{
    dispatch(setIsAddMember(true))
  }
  const deleteHandler=()=>{
    deleteGroup("Deleting Grorup... ",chatId)
    closeConfirmDeleteHandler()
    navigate('/')
  }

  const closeConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(false)
  }

  const removeMemberHandler=(userId)=>{
    removeMembers("Removing Member...",{chatId, userId})
  }
  useEffect(()=>{
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return ()=>{
      setGroupNameUpdatedValue('')
      setGroupName('')
      setIsEdit(false)
    }
  },[chatId])

  const ButtonGroup=(
    <Stack direction={{xs:'column-reverse',sm:'row'}} spacing={'1rem'}
    p={{xs:'0',sm:'1rem',md:'1rem 4rem'}}>
      <Button variant='contained' color='error' size='large' startIcon={<DeleteIcon/>}
      onClick={openConfirmDelete}>Delete Group</Button>
      <Button variant='contained' color='warning' size='large' startIcon={<AddIcon/>}
      onClick={openAddMember}>Add Members</Button>
    </Stack>
  )
  const IconBtns=(
  <>
      <Box sx={{
            display: {
              xs: 'block',
              sm: 'none',
              position: 'fixed',
              right: '1rem',
              top: '1rem'
            }
          }}>
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title='back'>
        <IconButton onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            bgcolor: '#1c1c1c',
            color: 'white',
            ":hover": {
              bgcolor: 'darkgray'
            }
          }}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>)

    const GroupName=(
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} padding={'3rem'} spacing={'1rem'}>
        {
          isEdit? 
          <>
            <TextField value={groupNameUpdatedValue}
            onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}/>
            <IconButton onClick={updateGroupName}><DoneIcon/></IconButton>
          </>:
          <>
            <Typography>{groupName}</Typography>
            <IconButton onClick={()=>setIsEdit(true)}
              disabled={isLoadingGroupName}><EditIcon/></IconButton>
          </>
        }
      </Stack>
    )
  return myGroups.isLoading? <Loader/>: (
    <Grid container height={'100vh'}>
      <Grid size={{ sm:4 }} 
      sx={{display:{
        xs:'none',
        sm:'block'
      }}}>
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>
      <Grid item xs={12} sm={8}
      sx={{
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        position:'relative',
        padding:'1rem 3rem'
      }}>
        {IconBtns}
        { groupDetails?.data && (
          <>
            {GroupName}

            <Typography margin={'2rem'} alignSelf={'flex-start'} variant='body'>
              Members
            </Typography>
            <Stack maxWidth={'45rem'} width={'100%'} boxSizing={'border-box'}
            padding={{
              sm:'1rem',
              xs:'0',
              md:'1rem 4rem'
            }}
            spacing={'2rem'} bgcolor={'bisque'} height={'50vh'} overflow={'auto'}>
              {/* Members in my group*/}

              {
                // In the UserItem isAdded passed as a prop is true by default. If you pass any props without declaring what it is, in the component side it will be a boolean value which will be true by default.
                isLoadingRemoveMembers? <CircularProgress/>:
                members && members.map((x) =>(
                  <UserItem user={x} key={X._id} isAdded handler={()=>removeMemberHandler(x._id)} 
                  styling={{
                    boxShadow: '0 0 0.5rem rgba(0,0,0,0.2)',
                    padding: '1rem 2rem',
                    borderRadius:'1rem'
                  }}/>
                ))
              }
            </Stack>

            {/* Add or Delete Members */}
            {ButtonGroup}
          </>
        )}
      </Grid>

        {
          isAddMember && (
            <Suspense fallback={<Backdrop  open/>}>
              <AddMemberDialog chatId={chatId}/>
            </Suspense>
          )
        }
      {
        confirmDeleteDialog && (
          <>
            <Suspense fallback={<Backdrop open/>}>
              <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}/>
            </Suspense>
          </>
        )
      }


      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose}
      sx={{
        display:{
          xs:'block',
          sm:'none'
        },
        backgroundColor:'yellow'
      }} w={'50vw'}>
        <GroupsList myGroups={samplechats} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}


const GroupsList=({w="100%",myGroups=[],chatId})=>{
  return (
    <Stack width={w} sx={{backgroundColor:'bisque',height:'100vh',overflow:'auto'}}>
      {
        myGroups.length>0 ? myGroups.map((group)=> <GroupListItem group={group} chatId={chatId} key={group._id}/>):(
          <Typography textAlign={'center'} padding={'1rem'} fontSize={'30px'} 
          fontWeight={'bold'}>You are not the admin of any group</Typography>
        )
      }
    </Stack>
  )
}

const GroupListItem=memo(({group,chatId})=>{
  // console.log(group)
  const{name,avatar,_id}=group
  return (
  <Link to={`?group=${_id}`} onClick={(e)=>{
    if(chatId==_id) e.preventDefault();
  }}>
    <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
      <AvatarCard avatar={avatar}/>
      <Typography>{name}</Typography>
    </Stack>
  </Link>
  )
})
export default Groups