import { User } from "../models/user.models.js"
import { ErrorHandler } from "../utils/utility.js"
import jwt from 'jsonwebtoken'
const isAuthenticated = (req, res, next)=>{
    try {
        const token=req.cookies['token']
        if(!token) return next(new ErrorHandler('Please login to access this route',401))
        const decodedData=jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decodedData)
        req.user=decodedData._id
        next()
    } catch (error) {
        console.error("Error in authentication ",error)
    }
}

const socketAuthenticator=async(err,socket,next)=>{
    try {
        if(err)
            return next(err)
        const authToken=socket.request.cookies['token']  // we can access the cookies because of the cookieParser inside io.use()
        // console.log("authToken: ",authToken)
        if(!authToken) return next(new ErrorHandler('Token not found',401))
        const decodedData=jwt.verify(authToken,process.env.JWT_SECRET)
        const user=await User.findById(decodedData._id)
        if(!user) return next(new ErrorHandler('User not found',401))
        socket.user=user
        //console.log("user: ",user)
        return next()
    } catch (error) {
        console.error("socket authenticator getChatDetails",error)
        return next(new ErrorHandler('Please login to access this socket route',401))
    }
}
export {isAuthenticated,socketAuthenticator}