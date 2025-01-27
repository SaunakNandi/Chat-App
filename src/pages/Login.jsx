import React, { useState } from 'react'
import {Container,Paper,Typography,Button,TextField, Stack, Avatar, IconButton} from '@mui/material'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponent'
import { useInputValidation,useFileHandler } from '6pp'
import { PasswordValidator, usernameValidator } from '../utils/validators'
const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const name=useInputValidation("")
  const bio=useInputValidation("")
  const username=useInputValidation("",usernameValidator)
  // console.log(username)
  const password=useInputValidation("",PasswordValidator)
  const avatar=useFileHandler('single')

  const handleSignup=(e)=>{
    e.preventDefault()
  }
  
  const handleLogin=(e)=>{
    e.preventDefault()
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
                <TextField required label="Username" margin="normal" variant="outlined" fullWidth/>
                <TextField required label="Password" margin="normal" variant="outlined" fullWidth type="password"/>
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
                    src={{
                      src:avatar.preview
                    }}/>
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