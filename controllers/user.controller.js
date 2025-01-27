import { compare } from 'bcrypt'
import {User} from '../models/user.models.js'
import {Chat} from '../models/chat.models.js'
import {Request} from '../models/request.models.js'
import { cookieOption, emitEvent, sendToken } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMember } from '../lib/helper.lib.js'

const login=async(req,res,next)=>{
    try {
        const {username,password}=req.body
        console.log(username,password)
        const user=await User.findOne({username}).select('+password')
        if(!user) return next(new ErrorHandler('Invalid user',404)) // this next will go to the errorMiddleware
           // return res.status(400).json({success:false,message:'Invalid Credentials'})
        const isMatch=await compare(password,user.password)
        if(!isMatch) return next(new ErrorHandler('Invalid credentials',404)) // this next will go to the errorMiddleware
            // return res.status(400).json({success:false,message:'Invalid Credentials'})
        sendToken(res,user,200,'User Logged In Successfully')
    } catch (error) {
        next(error)
    }
}

const newUser=async(req,res)=>{
    const {name,username,password,bio} = req.body
    console.log(req.body)
    const avatar={
        public_id:'sdfsd',
        url:'asdfd'
    }
    const user=await User.create({
        name,
        username,
        password,
        bio,
        avatar
    })

    sendToken(res,user,200,'User Created Successfully')
}

const getMyProfile=async(req,res,next)=>{
    const user=await User.findById(req.user)
    // console.log(req.user)
    if(!user) return next(new ErrorHandler("User not found",404))
    return res.status(200).json({success:true,user})
}

// Cookies are sent by the client to the server in the req.cookies object. However, res.clearCookie is used to instruct the browser to delete a cookie by sending a response header

const logout=async(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true, // Ensures the cookie is not accessible via JavaScript
        sameSite:true, // Prevents cross-site request forgery
    })
    return res.status(200).json({success:true,message:'User Logged Out Successfully'})
}

const searchUser=async(req,res)=>{
    const {name=""}=req.query  //req.query.name

    // finding all my chats
    const myChats=await Chat.find({groupChat:false,members:req.user})
    const allUsersFromMyChats=myChats.flatMap((chat)=>chat.members)  // chat.members is an array itself

    // $regex is built-in property in mongoose. So suppose if name is Saunak and userr search sau -> it will return user with name saunak and options "i" for case insensitive
    const allUsersExceptMeandFriends=await User.find({
        _id:{$nin:allUsersFromMyChats},
        name:{$regex:name,$options:"i"}  
    })

    // avatar.url can be done from frontend also but we did it from here
    //modifying the response
    const users=allUsersExceptMeandFriends.map(({_id,name,avatar})=>({_id,name,avatar:avatar.url}))
    return res.status(200).json({success:true,users})
}

const sendFrndReq=async(req,res,next)=>{
    const {userId}=req.body
    const request=await Request.findOne({
        $or:[
            {sender:req.user,receiver:userId},
            {sender:userId,receiver:req.user}
        ]
    })
    if(request) return next(new ErrorHandler('Friend Request already sent'))
    await Request.create({
        sender:req.user,
        receiver:userId
    })

    emitEvent(req,NEW_REQUEST,[userId])
    return res.status(200).json({success:true,message:'Friend Request Sent'})
}

const acceptFrndReq=async(req,res,next)=>{
    const {requestId,accept}=req.body
    const request=await Request.findById(requestId).populate("sender","name").populate("receiver","name")
    console.log(request)
    if(!request) return next(new ErrorHandler('Friend Request not found',404))
    if(request.receiver._id.toString()!==req.user.toString()) return next(new ErrorHandler('You are not authorized',401))
    
    if(!accept){
        await request.deleteOne()
        return res.status(200).json({success:true,message:'Request canceled'})
    }
    const members=[request.sender._id,request.receiver._id]
    await Promise.all([
        Chat.create({
            members,
            name:`${request.sender.name}-${request.receiver.name}`
        }),
        request.deleteOne()]
    )
    emitEvent(req,REFETCH_CHATS,members)
    return res.status(200).json({success:true,message:'Request accepted',senderId:request.sender._id})
}

const getMyNotifications=async(req,res)=>{
    const request=await Request.find({receiver:req.user}).populate("sender","name avatar")
    console.log(request)
    const all_requests=await request.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url
        }
    }))
    return res.status(200).json({success:true,request:all_requests})
}

// need frontend to understand this better
const getMyFriends=async(req,res)=>{
    const {chatId}=req.query
    const chats=await Chat.find({members:req.user,groupChat:false}).populate('members','name avatar')
    const friends=chats.map(({members})=>{
        const otherUser=getOtherMember(members,req.user)
        return {
            _id:otherUser._id,
            name:otherUser.name,
            avatar:otherUser.avatar.url
        }
    })
    if(chatId)
    {
        const chat=await Chat.findById(chatId)
        const availableFriends=friends.filter((friend)=> !chat.members.includes(friend._id))
        return res.status(200).json({success:true,availableFriends})
    }
    return res.status(200).json({success:true,friends})
}
export {login,newUser,getMyProfile,logout,searchUser,sendFrndReq,acceptFrndReq,getMyNotifications,getMyFriends}