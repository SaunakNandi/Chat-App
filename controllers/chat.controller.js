import { ErrorHandler } from "../utils/utility.js"
import {Chat} from '../models/chat.models.js'
import {User} from '../models/user.models.js'
import {Message} from '../models/message.models.js'
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js"
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js"
import { getOtherMember } from "../lib/helper.lib.js"

const newGroupChat=async(req,res,next)=>{
    const {name,members}=req.body
    const allMembers=[...members,req.user]
    await Chat.create({name,groupChat:true,creator:req.user,members:allMembers})
    emitEvent(req,ALERT,allMembers,`Welcome to ${name} group chat`)
    emitEvent(req,REFETCH_CHATS,members)

    return res.status(201).json({
        sucess:true,
        messsage:"Group created"
    })
}
const getMyChats=async(req,res,next)=>{
    
    // inside members we will get name and avatar
    const chats=await Chat.find({members:req.user}).populate('members','name avatar')
    
    const transformedChats=chats.map(({_id,name,members,groupChat})=>{
        const otherMember=getOtherMember(members,req.user)
        // console.log("otherMember ",otherMember)
        const whoseAvatar=groupChat? members.slice(0,3).map(({avatar})=>avatar.url):[otherMember?.avatar?.url]
        // could be done using filter than map
        const memberId=members.reduce((prev,cur)=>{
            if(cur._id.toString()!==req.user.toString()){
               prev.push(cur._id) 
            }
            return prev;
        },[])
        return {
            _id,
            name:groupChat?name:otherMember?.name,
            members:memberId,
            // lastMessage:lastMessage,
            groupChat:groupChat,
            avatar:whoseAvatar
        }
    })
    return res.status(201).json({
        sucess:true,
        chats:transformedChats
    })
}

const getMyGroups=async(req,res,next)=>{
    const chats=await Chat.find({
        members:req.user,
        groupChat:true,
        creator:req.user
    }).populate('members','name avatar')

    const groups=chats.map(({members,_id,groupChat,name})=>(
        {
        _id,
        name,
        groupChat,
        avatar:members.slice(0,3).map(({avatar})=>avatar.url),
        }
    ))
    return res.status(201).json({
        sucess:true,
        groups
    })
}

// chat.creator is of type ObjectID

const addMembers=async(req,res,next)=>{
    const {chatId,members}=req.body
    if(!members || members.length<1) return next(new ErrorHandler('At least one member is required',400))
    const chat=await Chat.findById((chatId))
    if(!chat) return next(new ErrorHandler('Not in your friend list',404))
    // console.log(members)
    if(!chat.groupChat) return next(new ErrorHandler('Not a group chat',400))
    if(chat.creator.toString()!==req.user.toString())
        return next(new ErrorHandler('You are not allowed to add members',403))

    const allNewMembersPromise=members.map(x=>(
        User.findById(x,"name")  // id with name
    ))
    // console.log("all members promise",allNewMembersPromise)
    const allNewMembers=await Promise.all(allNewMembersPromise)
    // console.log("all members",allNewMembers)
    let uniqueMembers=allNewMembers.filter(x=>!chat.members.includes(x._id.toString())) // x._id is not included in chat members
    uniqueMembers=uniqueMembers.map(x=>x._id)
    chat.members.push(...uniqueMembers)
    if(chat.members.length>200) return next(new ErrorHandler('Group members limit reached',400))

    await chat.save()
    const allUsersName=allNewMembers.map(x=>x.name).join(",") // [a,b,c] -> ["a", "b", "c"]
    // console.log("all users",allUsersName)
    emitEvent(req,ALERT,chat.members,{message:`${allUsersName} has been added to ${chat.name} group`,chatId})
    emitEvent(req,REFETCH_CHATS,chat.members)
    return res.status(201).json({
        sucess:true,
        messsage:"Members added successfully"    
    })
}

// if user not present in the group it still shows user has been removed from group
const removeMembers = async function(req,res,next){
    const {userId,chatId}=req.body
    const [chat,userToRemove]=await Promise.all([Chat.findById(chatId),User.findById(userId,"name")])
    if(!chat) return next(new ErrorHandler('Not in your friend list',404))
    if(!chat.groupChat) return next(new ErrorHandler('Not a group chat',400))
    if(chat.creator.toString()!==req.user.toString())
            return next(new ErrorHandler('You are not allowed to remove members',403))
    if(chat.members.length<4) return next(new ErrorHandler('Group chat must have at least 3 members',400))
        
     const allChatMembers=chat.members.map((x)=>x.toString())
    
    chat.members=chat.members.filter(
        (member)=>member.toString()!==userId.toString()
    )
    await chat.save()
    emitEvent(req,ALERT,chat.members,{message:`${userToRemove.name} has been removed from the group`,chatId})
    emitEvent(req,REFETCH_CHATS,allChatMembers,{userId})
    return res.status(201).json({
        sucess:true,
        messsage:"Members removed successfully"    
    })
}

const leaveGroup=async(req,res,next)=>{
    console.log("leave group")
    const chatId=req.params.id
    const chat=await Chat.findById(chatId)
    if(!chat) return next(new ErrorHandler('Not in your friend list',404))
    if(!chat.groupChat) return next(new ErrorHandler('Not a group chat',400))
    
    const remainingMembers=chat.members.filter((memberId=>memberId.toString()!==req.user.toString()))
    if(chat.creator.toString()===req.user.toString()) // if creator leaves the group
    {
        const randomNum=Math.floor(Math.random()*remainingMembers.length)
        const newCreator=remainingMembers[randomNum]
        chat.creator=newCreator
    }
    chat.members=remainingMembers
    const [user]=await Promise.all([User.findById(req.user,"name"),chat.save()])  
    emitEvent(req,ALERT,chat.members,{message:`${userToRemove.name} has been removed from the group`,chatId})
    return res.status(201).json({
        sucess:true,
        messsage:"Left the group"    
    })
}

const sendAttachment = async function(req,res,next){
    const {chatId}=req.body
    const files=req.files || []

    const [chat,me]=await Promise.all([Chat.findById(chatId),User.findById(req.user,"name")])
    if(!chat) return next(new ErrorHandler('Not in your friend list',404))
        
    if(files.length<1) return next(new ErrorHandler('No file uploaded',400))
    if(files.length>5) return next(new ErrorHandler(`Files can't be more than 4`,400))
    // upload files
    const attachments=await uploadFilesToCloudinary(files)
    const messageForDB={content:"",attachments,sender:me._id,chat:chatId}
    const messageForRealTime={
        ...messageForDB,
        sender:{
            _id:me._id,
            name:me.name
        },
    }
    const message=await Message.create(messageForDB)
    emitEvent(req,NEW_MESSAGE,chat.members,{
        message:messageForRealTime,
        chatId
    })
    emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId})
    return res.status(201).json({
        sucess:true,
        message   
    })
}

const getChatDetails = async function(req,res,next){
    try {
        // for group chat 
        if(req.query.populate==="true")
        {
            const chat=await Chat.findById(req.params.id).populate('members','name avatar').lean()
            // we dont want to alter the chat.members in database so we will not save but we still need to save the chat.members so we can use .lean()
            // console.log("chat members",chat.members)
            // Now chat will not be a mongoose object i.e it will be a plain javascript object
            chat.members=chat.members.map(({_id,name,avatar})=>({
                _id,
                name,
                avatar:avatar.url
            }))
            // console.log("chat members after",chat.members)
            return res.status(201).json({
                sucess:true,
                chat
            })
        }
        else{  // for 1 - 1 chat
            const chat=await Chat.findById(req.params.id)
            if(!chat) return next(new ErrorHandler('Chat not found',404))
            return res.status(201).json({
                sucess:true,
                chat
            })
        }
    } catch (error) {
        console.log("getChatDetails",error)
    }
}

const renameGroup=async(req,res,next)=>{
    const chatId=req.params.id
    const {name}=req.body
    const chat=await Chat.findById(chatId)
    if(!chat) return next(new ErrorHandler('Chat not found',404))
    if(!chat.groupChat) return next(new ErrorHandler('Not a group chat',400))
    if(chat.creator.toString()!==req.user.toString())
        return next(new ErrorHandler('You are not allowed to rename the group',403))

    chat.name=name
    await chat.save()
    emitEvent(req,REFETCH_CHATS,chat.members,`${chat.name} has been renamed to ${name}`)
    return res.status(201).json({
        sucess:true,
        message:"Group renamed successfully"
    })
}

const deleteChat = async function(req,res,next){
    try {
        const chatId=req.params.id
        const chat=await Chat.findById(chatId)
        if(!chat) return next(new ErrorHandler('Chat not found',404))
        if(chat.groupChat && chat.creator.toString()!==req.user.toString()) 
            return next(new ErrorHandler('You are not allowed to delete the group',403))

        const members=chat.members
        // not present in the group
        if(!chat.groupChat && !chat.members.includes(req.user.toString()))
            return next(new ErrorHandler('You are not allowed to delete the chat',403))

        // Here we have to delete all messages as well as attachments from Cloudinary too
        const messagesWithAttachments=await Message.find(
            {
                chat:chatId,
                attachments:{$exists:true, $ne:[]}, // attachments should exists and should not be empty
            }
        )

        const public_ids=[]
        messagesWithAttachments.forEach(({attachments})=>{
            attachments.forEach(({public_id})=>{
                public_ids.push(public_id)
            })
        })

        await Promise.all([
            deleteFilesFromCloudinary(public_ids),
            chat.deleteOne(),
            Message.deleteMany({chat:chatId})
        ])
        emitEvent(req,REFETCH_CHATS,members)
        return res.status(201).json({
            sucess:true,
            message:"Chat deleted successfully"
        })
    } catch (error) {
        console.log("delete chat ",error)
    }
}

const getMessages=async (req,res,next)=>{
    try {
        const chatId=req.params.id
        const {page=1}=req.query
        const resultPerPage=20
        const skip=(page-1)*resultPerPage

        // Trying to access a group chat you are not a part of
        const chat=await Chat.findById(chatId)
        // console.log("chat ",chat)
        if(!chat) return next(new ErrorHandler("Chat not found",404))
        if(!chat.members.includes(req.user.toString())) return next(new ErrorHandler("You are not allowed to access this chat",403))

        const [messages,totalMessagesCount]=await Promise.all([
            Message.find({chat:chatId}).sort({createdAt:-1}).skip(skip).limit(resultPerPage).populate('sender','name').lean(),
            Message.countDocuments({chat:chatId})
        ])
        const totalPages=Math.ceil(totalMessagesCount/resultPerPage) || 0
        return res.status(201).json({
            sucess:true,
            message:messages.reverse(),
            totalPages
        })
    } catch (error) {
        console.log("get Message Error ",error)
    }
}
export {newGroupChat,getMyChats,getMyGroups,addMembers,removeMembers,leaveGroup,sendAttachment,getChatDetails,renameGroup,deleteChat,getMessages}