import { Container, TextField, Paper, Stack, Button, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useAsyncMutation } from '../hooks/hook'
import { useForgotPasswordMutation } from '../redux/api/api'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const usernameRef=useRef(null)
    const passwordRef=useRef(null)
    const confirmpasswordRef=useRef(null)
    const [errors,setErrors]=useState({})
    const navigate=useNavigate()
    const [updatePassword,isLoadingUpdatePassword]=useAsyncMutation(useForgotPasswordMutation)
    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/; // Example: 4-16 chars, letters/numbers/underscore
    const passwordRegex = /^.{6,}$/; // Example: 6+ chars, 1 upper, 1 number

    const handleSubmit=(e)=>{

        e.preventDefault()
        try {
            const username=usernameRef.current.value.trim()
            console.log(username)
            const passowrd=passwordRef.current.value.trim()
            const confirmPassowrd=confirmpasswordRef.current.value.trim()
            const newError={}
            if(!usernameRegex.test(username)) newError.username="Expects atleast 4 chars any of the following letters,numbers,underscore"
            if(!passwordRegex.test(passowrd)) newError.password="Expects atleast 4 chars any of the following letters,numbers,underscore"
            if(confirmPassowrd!=passowrd) newError.confirmPassowrd="Password didn't match"

            if(Object.keys(newError).length>0)
            {
                setErrors(newError)
                return 
            }
            const formData=new FormData()
            formData.append("username",username)
            formData.append("password",passowrd)
            console.log(formData)
            updatePassword("Your password has been changed",{username,password:passowrd})
            if(!isLoadingUpdatePassword)
                navigate('/login')
        } catch (error) {
            console.log("error at forgotPassword",error)
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
                <form onSubmit={handleSubmit} style={{width:'100%',marginTop:"1rem"}}>
                    <TextField variant='outlined' margin='normal' inputRef={usernameRef} fullWidth label="username"/>
                    {
                        errors.username && <Typography color="error" variant='caption'>{errors.username}</Typography>
                    }
                    <TextField variant='outlined' margin='normal' inputRef={passwordRef} fullWidth label="password"/>
                    {
                        errors.passowrd && <Typography color="error" variant='caption'>{errors.passowrd}</Typography>
                    }
                    <TextField variant='outlined' margin='normal' inputRef={confirmpasswordRef} fullWidth label="confirm password"/>
                    {
                        errors.confirmPassowrd && <Typography color="error" variant='caption'>{errors.confirmPassowrd}</Typography>
                    }
                      <Stack alignItems="center" sx={{ width: '100%' }}>
                          <Button variant="contained" color="primary" sx={{ marginTop: '1rem', width: '50%' }} type="submit" disabled={isLoadingUpdatePassword}>
                              Confirm
                          </Button>
                      </Stack>
                </form>
            </Paper>
        </Container>
    </div>
  )
}

export default ForgotPassword