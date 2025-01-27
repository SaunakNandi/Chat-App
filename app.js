// use npm run dev to start the application

import express from 'express'
import userRoute from './routes/user.routes.js'
import chatRoute from './routes/chat.routes.js'
import { connectDB } from './utils/features.js'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'
import cookieParser from 'cookie-parser'
// import { createSingleChat,createGroupChat, createMessages, createMessagesInAChat } from './seeders/chat.js'
// import { createUser } from './seeders/user.js'

dotenv.config({
    path:'./.env'
})
connectDB(process.env.MONGO_URL)
// createUser(10)
// createSingleChat(10)
// createGroupChat(10)
// createMessagesInAChat('67961e683b1bab4d77ac2dc3',50) // rerum argulo
const app=express()
app.use(cookieParser())

app.use(express.json())  // to access the json data from request body
// app.use(express.urlencoded())  // to access the form data from request body

app.use('/user',userRoute)
app.use('/chat',chatRoute)

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.use(errorMiddleware)  // this will be the middleware to handle the errors

