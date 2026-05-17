import { compare } from 'bcrypt'
import {User} from '../models/user.models.js'
import {Chat} from '../models/chat.models.js'
import {Request} from '../models/request.models.js'
import { deleteFilesFromCloudinary, emitEvent, sendToken, uploadFilesToCloudinary } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMember } from '../lib/helper.lib.js'
import mongoose from 'mongoose'

const login=async(req,res,next)=>{
    try {
        // console.log(req.body)
        const {username,password}=req.body
        // console.log(username,password)
        const user=await User.findOne({username}).select('+password')
        if(!user) return next(new ErrorHandler('Invalid user',404)) // this next will go to the errorMiddleware
        const isMatch=await compare(password,user.password)
        if(!isMatch) return next(new ErrorHandler('Invalid credentials',404)) // this next will go to the errorMiddleware
        sendToken(res,user,200,'User Logged In Successfully')
    } catch (error) {
        next(error)
    }
}

const newUser=async(req,res,next)=>{
    try {
        const {name,username,password,bio} = req.body
        // console.log(req.body)
        const file=req.file
        if(!file) return next(new ErrorHandler('Please upload Image',11000))
            
        const isUsernameExist = await User.findOne({username})
        if(isUsernameExist) return next(new ErrorHandler('Username already exist',502))
        const result=await uploadFilesToCloudinary([file])
        const avatar={
            public_id:result[0].public_id,
            url:result[0].url,
        }
        const user=await User.create({
            name,
            username,
            password,
            bio,
            avatar
        })
    
        sendToken(res,user,200,'User Created Successfully')
    } catch (error) {
        console.log("New User error ",error)
    }
}

const forgotPassword=async(req,res,next)=>{
    try {
        const {username,password}=req.body
        console.log(req.body)
        console.log("username password",username,password)
        if (!password) {
            return next(new ErrorHandler("New password is required", 400));
        }

        const user=await User.findOne({username}).select('+password')
        console.log("user is ",user)

        if(!user) return next(new ErrorHandler('User Not found',404))
        user.password=password
        await user.save()
        return res.status(200).json({success:true})
        // sendToken(res,user,200,'User logged in successfully')
    } catch (error) {
        console.log("forgotPassword error ",error)
    }
}

const getMyProfile=async(req,res,next)=>{
    const user=await User.findById(req.user)
    console.log(req.user)
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
    //same as req.query.name
    const {name="",id=""}=req.query  //If name is not present in req.query, it defaults to an empty string ("").
    
    // finding all my connections
    const myChats=await Chat.find({groupChat:false,members:req.user})  // getting req.user from isAuthenticated
    const allUsersFromMyChats=myChats.flatMap((chat)=>chat.members.map(id => id.toString()))  // chat.members is an array itself
    // $regex is built-in property in mongoose. So suppose if name is Saunak and user search sau -> it will return user with name saunak and options "i" for case insensitive

    const requests=await Request.find({sender:req.user})//.populate('receiver','_id')
    const receiverIds=requests.map(item=>item.receiver.toString())
    // console.log("allUsersFromMyChats",allUsersFromMyChats)
    // const currentUserObjectId = new mongoose.Types.ObjectId(String(id));  // converting to string for VScode warning
    // const nottoConsiderThoseids=allUsersFromMyChats.length?[...allUsersFromMyChats,currentUserObjectId]:[currentUserObjectId]
    
    // // find all users excluding those whom I have sent request
    
    // const excludeIds=[...nottoConsiderThoseids,...receiverIds]

    const excludeIdsStrings=[...allUsersFromMyChats,...receiverIds,req.user.toString()]
    const excludeObjectIds = excludeIdsStrings.map(id => new mongoose.Types.ObjectId(id));
    console.log("ExcludedIds ",excludeObjectIds)
    const allUsersExceptMeandFriends=await User.find({
        _id:{$nin:excludeObjectIds},
        $or:[
            {name:{$regex:name,$options:"i"}},
            {username:{$regex:name,$options:"i"}}  
        ]
    })

    console.log("allUsersExceptMeandFriends ",allUsersExceptMeandFriends)
    //modifying the response 
    const users=allUsersExceptMeandFriends.map(({_id,name,avatar})=>({_id,name,avatar:avatar.url || ""}))

    const allUsers = await User.find({});
    console.log("All available users ",allUsers)
    console.log("Available Users ",users)
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
    // if(request) return next(new ErrorHandler('Friend Request already sent'))
    await Request.create({
        sender:req.user,
        receiver:userId
    })

    emitEvent(req,NEW_REQUEST,[userId])
    return res.status(200).json({success:true,message:'Friend Request Sent'})
}

const cancelFrndReq=async(req,res,next)=>{
    const {userId}=req.query
    console.log("requested userID is ",userId)
    const request=await Request.deleteOne({sender:req.user,receiver:userId})
    console.log("Requests ",request)
    if(request.deletedCount==0) return next(new ErrorHandler('Request not found or already deleted')) 
    return res.status(200).json({success:true,message:'Friend request cancelled'})
}
// req.user comming from isAuthenticated
const acceptFrndReq=async(req,res,next)=>{
    const {requestId,accept}=req.body

    // Mongoose fetches only:
    // name (because you specified it)
    // _id (because it's included by default)
    // But it does NOT fetch other fields like email, age, etc.
    const request=await Request.findById(requestId).populate("sender","name").populate("receiver","name")

    if(!request) return next(new ErrorHandler('Friend Request not found',404))
    if(request.receiver._id.toString()!==req.user.toString()) return next(new ErrorHandler('You are not authorized',401))
    
        // rejected
    if(!accept){
        await request.deleteOne()
        return res.status(200).json({success:true,message:'Request canceled'})
    }
    //accepted
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
    // console.log(request)
    const all_requests= request.map((reqDoc)=>{
        const {sender,_id,message}=reqDoc
        return {
        _id,
        type:reqDoc.type || "FRIEND_REQUEST",
        message,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url
        }
    }})
    return res.status(200).json({success:true,request:all_requests})
}

const clearNotification=async(req,res,next)=>{
    const {id}=req.query
    try {
        if(!id) return next(new ErrorHandler("Notification ID is required", 400));
        const notification=await Request.findById(id)
        if(!notification) return next(new ErrorHandler("No  notificaiton found"));
        if(notification.receiver.toString()!==req.user.toString())
            return next(new ErrorHandler("You are not authorisized to access this notification "));
        await notification.deleteOne()
        return res.status(200).json({success:true,message: "Notification dismissed successfully"})
    } catch (error) {
        console.log("Error is given by ",error)
        return res.status(500).json({success:false,message:`error while deleting notification ${error}`})
    }
}

// need frontend to understand this better
const getMyFriends=async(req,res)=>{
    const {chatId}=req.query
    const chats=await Chat.find({members:req.user,groupChat:false}).populate('members','name avatar')
    let friends=chats.map(({members})=>{
        const otherUser=getOtherMember(members,req.user) // in members[] it has the friend's_id and authenticated user's_id. So I need only my friend's_id
        return {
            _id:otherUser._id,
            name:otherUser.name,
            avatar:otherUser.avatar.url
        }
    })
    // we did this to remove duplicates if any
    friends=Array.from(new Map(friends.map((x)=> [x._id.toString(),x])).values())
    // console.log("my friends ",friends)
    if(chatId)
    {
        const chat=await Chat.findById(chatId)
        const availableFriends=friends.filter((friend)=> !chat.members.includes(friend._id))
        return res.status(200).json({success:true,availableFriends})
    }
    return res.status(200).json({success:true,friends})
}

const getUserDetails=async(req,res)=>{
    const {id}=req.query
    console.log("users userId",id)
    try {
        const friendsData=await User.findById(id)
        console.log("friendsData ",friendsData)
        return res.status(200).json({success:true,friendsData})
    } catch (error) {
        console.log("Error at getUserDetails ",error)
        // return res.status(500).jons({message:"Not able to get user data"})
    }
}

const updateMyProfile=async(req,res,next)=>{
    try {
        const {name,bio}=req.body
        const imgFile=req.file
        const user=await User.findById(req.user)
        console.log("user found ",user)
        if(!user) return next(new ErrorHandler("User not found",404))

        if (!name && !bio && !imgFile) return res.status(200).json({ user });
        const public_id=user.avatar?.public_id
        let avatar=null
        if(imgFile)
        {
            await deleteFilesFromCloudinary(public_id)
            let result=await uploadFilesToCloudinary([imgFile])
            console.log(result)
            avatar={public_id:result.public_id,url:result.url}
        }
        if(avatar)
            user.avatar=avatar
        user.bio=bio || user.bio
        user.name=name || user.name
        console.log("updated user",user)
        await user.save()
        return res.status(200).json({success:true,message:'User is updated',user})
    } catch (error) {
        console.log("Error at update my profile ",error)
    }
}
export {login,newUser,getMyProfile,logout,searchUser,sendFrndReq,acceptFrndReq,getMyNotifications,getMyFriends,getUserDetails,updateMyProfile,forgotPassword,cancelFrndReq,clearNotification}