import { body,validationResult,check,param,query } from "express-validator"
import { ErrorHandler } from "../utils/utility.js"

export const validateHandler=(req,res,next)=>{
    // console.log(req)
    const errors=validationResult(req)
    // console.log(errors)
    const errorMsg=errors.array().map((error)=>error.msg).join(",")
    if(errors.isEmpty()) return next()
    else {
        console.error("error msg", errorMsg)
next(new ErrorHandler(errorMsg,601))}
}
export const registerValidator=()=>[
    body("name", "Please enter name").notEmpty(),
    body("username", "Please enter username").notEmpty(),
    body("bio", "Please enter bio").notEmpty(),
    body("password", "Please enter password").notEmpty(),
    
]

export const loginValidator=(req,res,next)=>[
    body("username", "Please enter username").notEmpty(),
    body("password", "Please enter password").notEmpty(),
]

export const newGroupValidator=(req,res,next)=>[
    body("name", "Please enter name").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter members").isArray({min:2,max:200}).withMessage("Group chat must have at least 3 members"),
]

export const addMembersValidator=(req,res,next)=>[
    body("chatId", "ChatId needed").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter members").isArray({min:1,max:197}).withMessage("Members must be atlast 1 to 197"),
]

export const removeValidator=(req,res,next)=>[
    body("chatId", "ChatId needed").notEmpty(),
    body("userId", "UserId needed").notEmpty(),
]

export const sendAttachmentsValidator=(req,res,next)=>[
    body("chatId", "ChatId needed").notEmpty(),
    // check('file', 'Upload your attachments').notEmpty().isArray({min:1,max:5}).withMessage("File size less than 100mb"),
]

export const chatIdValidator=(req,res,next)=>[
    param('id','ChatId needed').notEmpty(),
]

export const renameValidator=(req,res,next)=>[
    param('id','ChatId needed').notEmpty(),
    body("name",'New Name needed').notEmpty()
]

export const sendRequestValidator=(req,res,next)=>[
    body("userId",'userId not found').notEmpty()   
]

export const acceptRequestValidator=(req,res,next)=>[
    body("requestId",'requestId not found').notEmpty(),
    body('accept').notEmpty().withMessage('Add accept' ).isBoolean().withMessage('Accept must be a boolean')
]