import { AppBar, Backdrop, Box, ClickAwayListener, IconButton, Paper, Popper, Stack, Toolbar, Typography } from '@mui/material'
import { lazy, Suspense, useRef, useState } from 'react'
import { orange } from '../../constants/Color'
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Logout as LogoutIcon, 
    Notifications as NotificationsIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { IconBtn } from '../shared/IconBtn'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import toast from 'react-hot-toast'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotifications } from '../../redux/reducers/chat'
import { getSocket } from '../../socket'

const SearchBox=lazy(()=> import('../specific/SearchBox'))
const NotificationBell=lazy(()=> import('../specific/NotificationsBell'))
const NewGroups=lazy(()=> import('../specific/NewGroups'))

const Header = () => {
    const [isUpdateOptionOpen,setIsUpdateOptionOpen]=useState(false)
    const socket=getSocket()
    const server=import.meta.env.VITE_SERVER
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const anchorRef=useRef(null)
    const {isSearch,isNotification,isNewGroup}=useSelector(state=>state.misc)
    const {notificationCount}=useSelector(state=>state.chat)
    const handleMobile=()=>{
        dispatch(setIsMobile(true))
    }
    const openSearch=()=>{
        dispatch(setIsSearch(true))
    }
    const openNewGroup=()=>{
        dispatch(setIsNewGroup(true))
    }
    const navigateGroup=()=>{
        navigate('/groups')
    }
    const openNotification=()=>{
        dispatch(setIsNotification(true))
        dispatch(resetNotifications())
    }
    const logoutHandler=async()=>{
        // Logout logic here
        if (socket) {
            socket.disconnect();
        }
//       withCredentials- ✅ Allows sending & receiving cookies (useful for authentication).
// ✅ Needed for sessions & JWT tokens when working with CORS requests.
        try {
            const {data}=await axios.get(`${server}/api/v1/user/logout`,{
                withCredentials:true,
            })
            dispatch(userNotExists())
            toast.success(data.message)
            navigate('/login')
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Logout not working")
        }
    }
  return (
    <>
        <Box sx={{flexGrow:1}} height={"4 rem"}>
            <AppBar sx={{
                bgcolor:orange,
                position:"static",
            }}>
                <Toolbar>
                    <Typography variant='h6' sx={{display:{xs:"none",sm:"block"}}}>Chat App</Typography>
                    {/* Hamburger menu */}
                    <Box sx={{display:{xs:"block",sm:"none"}}}>
                        <IconButton color='inherit' onClick={handleMobile}>
                            <MenuIcon></MenuIcon>
                        </IconButton>
                    </Box>
                    <Box sx={{flexGrow:1}}></Box>
                    <Box >
                        <IconBtn title={"Search"} icon={<SearchIcon/>} func={openSearch}></IconBtn>
                        <IconBtn title={"New Group"} icon={<AddIcon/>} func={openNewGroup}></IconBtn>
                        <IconBtn title={"Manage Groups"} icon={<GroupIcon/>} func={navigateGroup}></IconBtn>
                        <IconBtn title={"Notifications"} icon={<NotificationsIcon/>} func={openNotification} value={notificationCount}/>
                        <IconBtn title={"Logout"} icon={<LogoutIcon/>} func={logoutHandler}></IconBtn>
                        <IconBtn icon={<MoreVertIcon/>} func={()=>setIsUpdateOptionOpen(true)} ref={anchorRef}/>
                        {
                            isUpdateOptionOpen && (
                            <Popper open={isUpdateOptionOpen} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 1300}}>
                                <ClickAwayListener onClickAway={()=>setIsUpdateOptionOpen(false)}>
                                    <div>
                                        <Suspense fallback={<Backdrop open />}>
                                            <Paper sx={{ p: 2, mt: 1 }}>
                                                <Link to={'/update'} style={{textDecoration:'none',color:'black'}}>Update My Profile</Link>
                                            </Paper>
                                        </Suspense>
                                    </div>
                                </ClickAwayListener>
                            </Popper>
                            )
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
        {
            isSearch && (
                <Suspense fallback={<Backdrop open/>}>
                    <SearchBox/>
                </Suspense>
            )
        }
        {
            isNewGroup && (
                <Suspense fallback={<Backdrop open/>}>
                    <NewGroups/>
                </Suspense>
            )
        }
        {
            isNotification && (
                <Suspense fallback={<Backdrop open/>}>
                    <NotificationBell/>
                </Suspense>
            )
        }
        
    </>
  )
}


export default Header