import React, { useState } from 'react'
import {Container,Paper,Typography,Button,TextField, Stack, Avatar, IconButton} from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponent'
import { useInputValidation,useFileHandler } from '6pp'
import { PasswordValidator, usernameValidator } from '../utils/validators'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'
import {server} from '../constants/config'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const name=useInputValidation("")
  const bio=useInputValidation("")
  const username=useInputValidation("",usernameValidator)
  // console.log(username)
  const password=useInputValidation("",PasswordValidator)
  const avatar=useFileHandler('single')
  const dispatch=useDispatch()
  const config={
    withCredentials:true,
    headers:{
      'Content-Type':'application/json'
    }
}
  const handleSignup=async(e)=>{
    e.preventDefault()

    const formData=new FormData()
    formData.append('avatar',avatar.file)
    formData.append('name',name.value)
    formData.append('bio',bio.value)
    formData.append('username',username.value)
    formData.append('password',password.value)

    try {
      const {data}=await axios.post(`${server}/api/v1/user/new`,formData,
      {
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data",
        }
      })
      console.log(data)
      dispatch(userExists(data.user))
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }
  
  const handleLogin=async(e)=>{
    e.preventDefault()
    try {
      
      const {data}=await axios.post(`${server}/api/v1/user/login`,{
        username:username.value,
        password:password.value
      }, config)
      console.log(data)
      dispatch(userExists(data.user))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
      console.log(error)
    }
  }
  return (
    <div style={{backgroundImage:'linear-gradient(rgb(255,255,210),rgb(249,159,159))'}}>
      <Container component={"main"} maxWidth="xs"
      sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>
        <Paper elevation={3} style={{padding:20,marginTop:20}}
        sx={{padding:4,display:"flex",flexDirection:"column",alignItems:"center"}}>
          {
            isLogin?(
              <>
              <Typography variant="h5">Login</Typography>
              <form style={{width:'100%',marginTop:"1rem"}} onSubmit={handleLogin}>
                <TextField required label="Username" margin="normal" variant="outlined" fullWidth
                value={username.value} onChange={username.changeHandler}/>
                <TextField required label="Password" margin="normal" variant="outlined" fullWidth type="password"
                value={password.value} onChange={password.changeHandler}/>
                <Button sx={{marginTop:'1rem'}} variant="contained" color="primary" type="submit" fullWidth>Login</Button>
                <Typography textAlign={"center"} m={"1rem"}>or</Typography>
                <Button variant="text" fullWidth onClick={()=>setIsLogin(false)}>Signup instead</Button>
              </form>
                </>
            ):(
              <>
                <Typography variant="h5">Sign Up</Typography>
                <form style={{width:'100%',marginTop:"1rem"}} onSubmit={handleSignup}>
                  <Stack position={"relative"} width={"10rem"} margin={'auto'}>
                    <Avatar sx={{
                      width:'10rem',
                      height:'10rem',
                      objectFit:'contain'
                    }}
                    src={
                      avatar.preview
                    }/>
                    <IconButton sx={{
                      position:'absolute',
                      bottom:0,
                      right:0,
                      cursor:'pointer',
                      color:'white',
                      bgcolor:'rgba(0, 0, 0, 0.57)',
                      ":hover":{
                        bgcolor:'rgba(39, 39, 39, 0.1)'
                      }
                    }}
                    component="label">
                        <CameraAlt></CameraAlt>
                        <VisuallyHiddenInput type='file' onChange={avatar.changeHandler}/>
                    </IconButton>
                  </Stack>
                  <TextField required label="Name" margin="normal" variant="outlined" fullWidth
                  value={name.value}
                  onChange={name.changeHandler}/>
                  <TextField required label="Bio" margin="normal" variant="outlined" fullWidth
                  value={bio.value}
                  onChange={bio.changeHandler}/>
                  <TextField required label="Username" margin="normal" variant="outlined" fullWidth
                  value={username.value}
                  onChange={username.changeHandler}/>
                  {
                    username.error && (
                      <Typography color="error" variant='caption'>{username.error}</Typography>
                    )
                  }
                  <TextField required label="Password" margin="normal" variant="outlined" fullWidth type="password"
                  value={password.value}
                  onChange={password.changeHandler}/>
                  {
                    password.error && (
                      <Typography color="error" variant='caption'>{password.error}</Typography>
                    )
                  }
                  <Button variant="contained" color="primary" sx={{marginTop:'1rem'}} type="submit" fullWidth>Sign Up</Button>
                  <Typography textAlign={"center"} m={"1rem"}>or</Typography>
                  <Button variant="text" fullWidth onClick={()=>setIsLogin(true)}>Login instead</Button>
                </form>
              </>
            )
          }
        </Paper>
      </Container>
    </div>
  )
}

export default Login