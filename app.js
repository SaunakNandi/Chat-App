// use npm run dev to start the application

import express from 'express'
import userRoute from './routes/user.routes.js'
import chatRoute from './routes/chat.routes.js'
import { connectDB } from './utils/features.js'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import {createServer} from 'http'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js'
import {v4 as uuid} from 'uuid'
import { getSockets } from './lib/helper.lib.js'
import { Message } from './models/message.models.js'
// import { createSingleChat,createGroupChat, createMessages, createMessagesInAChat } from './seeders/chat.js'
// import { createUser } from './seeders/user.js'

dotenv.config({
    path:'./.env'
})

export const envMode=process.env.NODE_ENV.trim() || "PRODUCTION"
connectDB(process.env.MONGO_URL)
// createUser(10)
// createSingleChat(10)
// createGroupChat(10)
// createMessagesInAChat('67961e683b1bab4d77ac2dc3',50) // rerum argulo
const app=express()
const server=createServer(app);
const io=new Server(server,{})
const userSocketIDs=new Map()   // it contains all the users connected to the socket

app.use(cookieParser())
app.use(express.json())  // to access the json data from request body
// app.use(express.urlencoded())  // to access the form data from request body

app.use('/user',userRoute)
app.use('/chat',chatRoute)

//middleware
io.use((socket,next)=>{
    // alternate method handsake
})
io.on('connection',(socket)=>{
    console.log('User connected')
    const user={
        _id:'asdada',
        name:'user'
    }
    userSocketIDs.set(user._id.toString(),socket.id)  // keeping track of the user._id connected to the socket.id
    console.log(userSocketIDs)
    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
        const messageForRealTime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name
            },
            chat:chatId,
            createdAt:new Date().toISOString(),
        }
        const messageForDB={
            content:message,
            sender:user._id,
            chat:chatId,
        }
        // sending all the members received from frontend
        const membersSocket=getSockets(members)  // contain id's of members
        io.to(membersSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealTime
        })
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})

        try {
            await Message.create(messageForDB)
        } catch (error) {
            console.error(error)
        }
        console.log(NEW_MESSAGE,messageForRealTime) 
    })
    socket.on('disconnect',()=>{
        console.log('User disconnected')
        userSocketIDs.delete(user._id.toString())
    })
})

app.use(errorMiddleware)  // this will be the middleware to handle the errors


server.listen(3000,()=>{
    console.log(`Server is running on port 3000 in ${envMode} mode`)
})

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

export {userSocketIDs}
