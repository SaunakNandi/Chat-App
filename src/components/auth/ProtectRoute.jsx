import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'

const ProtectRoute = ({children,user,redirect='/login',txt="xd"}) => {
  console.log(user)
  if (!user) return <Navigate to={redirect} />;
  if(children)
  {
    console.log("Hello")
    return children
  }
  else{
    console.log("Brooo");
    return <Outlet />
  }
} 

export default ProtectRoute