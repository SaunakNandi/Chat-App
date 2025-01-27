import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = ({children,user,redirect='/login'}) => {
  // console.log(children)
    if(!user)  return <Navigate to={redirect}></Navigate>
  return children? children:<Outlet/>
}

export default ProtectRoute