import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from 'cloudinary'
import {v4 as uuid} from "uuid"
import { getBase64, getSockets } from "../lib/helper.lib.js"
const cookieOption={
    maxAge:15*24*60*60*1000,
    sameSite:"none",
    httpOnly:true,
    secure:true,
}
const connectDB=(uri)=>{
    mongoose.connect(uri,{dbName:"Chattu"})
    .then((data)=>{
        console.log(`Connected to the database: `)
    }).catch(err=>{
        console.error(err)
        throw err
    })
}

const sendToken=(res,user,code,message)=>{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
    // expires:new Date(Date.now()+30*24*60*60*1000),
    return res.status(code).cookie('token',token,cookieOption).json({success:true,user,message})
}

const emitEvent=(req,event,users,data)=>{
    const io=req.app.get("io")
    const usersSocket=getSockets(users)
    io.to(usersSocket).emit(event,data)
    console.log('Emitting event: ',data)
}

//this can be used to upload image/multiple files

const uploadFilesToCloudinary=async(files=[])=>{
    if(files.length===0) return null
    const uploadPromises=files.map((file)=>{
        // take everything in promise and resolve all at once using Promise.all
        return new Promise((resolve,reject)=>{

            // predefined cloudinary code
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type:'auto',
                    public_id:uuid()
                },
                (err,result)=>{
                    if(err) return reject(err)
                    resolve(result)
            })
        })
    })
    try {
        const results=await Promise.all(uploadPromises)
        const formattedResult=results.map((result)=>(
            {
                public_id:result.public_id,
                url:result.secure_url   
            }
        ))
        return formattedResult
    } catch (error) {
        console.log("Error while uploading ",error)
        throw new Error("Erron uploading files to cloudinary",error)
    }
}

const deleteFilesFromCloudinary=async(public_ids)=>{
    //

}


export {connectDB,sendToken,cookieOption,emitEvent,deleteFilesFromCloudinary,uploadFilesToCloudinary}