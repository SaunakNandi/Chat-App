import { Avatar, Container, Paper, TextField, Typography, Stack, IconButton, Button } from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponent'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userExists } from '../redux/reducers/auth'
import axios from 'axios'
import {server} from '../constants/config'

const UpdateProfile = () => {
    const [errors,setErrors]=useState({})
    const [loading,setLoading]=useState(false)
    const {user}=useSelector(state=>state.auth)
    const navigate=useNavigate()
    const nameRef=useRef(null)
    const bioRef=useRef(null)
    const avatarRef=useRef(null)
    console.log("User is ",user)
    const nameRegex = /^[A-Za-z ]{2,50}$/;
    const dispatch=useDispatch()
    // we are not considering password 
    async function handleSubmit(e)
    {
        e.preventDefault()
        console.log(avatarRef.current.files[0])
        setLoading(true)
        try {
            const newError={}
            // console.log(nameRef.current.value,bioRef.current.value)
            const name=nameRef.current.value.trim()
            const bio=bioRef.current.value.trim()
            const avatar=avatarRef.current.files[0]
            if(!nameRegex.test(name)) newError.name="Expects only letters with space allowed between name"
            
            setErrors(newError)
            const formData=new FormData()
            formData.append("name",name)
            formData.append("bio",bio)
            formData.append("avatar",avatar)
            console.log(formData)
            const {data}=await axios.patch(`${server}/api/v1/user/update-profile`,
                formData,
                {
                    withCredentials:true,
                }
            )
            console.log("data",data)
            dispatch(userExists(data.user))
            navigate('/')
        } catch (error) {
            console.log("error",error)
        } finally{
            setLoading(false)
        }
    }
  return user && (
    <div style={{backgroundImage:'linear-gradient(rgb(255,255,210),rgb(249,159,159))'}}>
          <Container component={"main"} maxWidth="xs" sx={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Paper elevation={3} style={{padding:20,marginTop:20}} >
                <Typography>Update Profile</Typography>
                <form onSubmit={handleSubmit} style={{width:'100%',marginTop:"1rem"}}>
                    <Stack position={"relative"} width={"10rem"} margin={'auto'}>
                        <Avatar src={user.avatar.url} sx={{width:'10rem',height:'10rem',objectFit:'contain'}}/>
                        <IconButton sx={{position:'absolute',bottom:0,right:0,cursor:'pointer',color:'white',bgcolor:'rgba(0, 0, 0, 0.57)',
                        ":hover":{
                            bgcolor:'rgba(39, 39, 39, 0.1)'
                        }}}
                        component="label">
                            <CameraAlt></CameraAlt>
                            <VisuallyHiddenInput type='file' ref={avatarRef} accept="image/*"/>
                        </IconButton>
                    </Stack>
                    {/* inputRef for <TextField/> */}
                    <TextField defaultValue={user.name} inputRef={nameRef} margin="normal" variant="outlined" fullWidth/>
                    {
                        errors.name && <Typography color="error" variant='caption'>{errors.name}</Typography>
                    }
                    <TextField defaultValue={user.bio} inputRef={bioRef} margin="normal" variant="outlined" fullWidth/>
                    
                    <Stack alignItems="center" sx={{ width: '100%' }}>
                        <Button variant="contained" color="primary" sx={{ marginTop: '1rem', width: '50%' }} type="submit" disabled={loading}>
                            Update Profile
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    </div>
  )
}

export default UpdateProfile