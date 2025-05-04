import { AppBar, Backdrop, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { orange } from '../../constants/Color'
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Logout as LogoutIcon, 
    Notifications as NotificationsIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { IconBtn } from '../shared/IconBtn'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import toast from 'react-hot-toast'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotifications } from '../../redux/reducers/chat'

const SearchBox=lazy(()=> import('../specific/SearchBox'))
const NotificationBell=lazy(()=> import('../specific/NotificationsBell'))
const NewGroups=lazy(()=> import('../specific/NewGroups'))

const Header = () => {
  const server=import.meta.env.VITE_SERVER
    const navigate=useNavigate()
    const dispatch=useDispatch()
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
            <AppBar  sx={{
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