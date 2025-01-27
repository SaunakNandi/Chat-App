import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const cookieOption={
    maxAge:15*24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true,
}
const connectDB=(uri)=>{
    mongoose.connect(uri,{dbName:"Chattu"})
    .then((data)=>{
        console.log(`Connected to the database: ${data.connection.host}`)
    }).catch(err=>{
        console.error(err)
        throw err
    })
}

const sendToken=(res,user,code,message)=>{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
    // console.log(token)
    // expires:new Date(Date.now()+30*24*60*60*1000),
    return res.status(code).cookie('token',token,cookieOption).json({success:true,message})
}

const emitEvent=(req,event,users,data)=>{
    console.log('Emitting event: ',event)
}

const deleteFilesFromCloudinary=async(public_ids)=>{
    //

}


export {connectDB,sendToken,cookieOption,emitEvent,deleteFilesFromCloudinary}