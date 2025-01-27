import { AppBar, Backdrop, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/Color'
import { Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon, Logout as LogoutIcon, 
    Notifications as NotificationsIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { IconBtn } from '../shared/IconBtn'

const SearchBox=lazy(()=> import('../specific/SearchBox'))
const NotificationBell=lazy(()=> import('../specific/NotificationsBell'))
const NewGroups=lazy(()=> import('../specific/NewGroups'))

const Header = () => {
    const navigate=useNavigate()
    const [ismobile,setIsMobile]=useState(false)
    const [isSearch,setIsSearch]=useState(false)
    const [isNewGroup,setIsNewGroup]=useState(false)
    const [isNotification,setIsNotification]=useState(false)

    const handleMobile=()=>{
        setIsMobile(prev=>!prev)
    }
    const openSearch=()=>{
        setIsSearch(prev=>!prev)
    }
    const openNewGroup=()=>{
        setIsNewGroup(prev=>!prev)
    }
    const navigateGroup=()=>{
        navigate('/groups')

    }
    const logoutHandler=()=>{
        // Logout logic here
        navigate('/login')
    }
    const openNotification=()=>{
        setIsNotification(prev=>!prev)
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
                        <IconBtn title={"Notifications"} icon={<NotificationsIcon/>} func={openNotification}></IconBtn>
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