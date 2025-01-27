import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachment } from '../controllers/chat.controller.js';
import { attachments } from '../middlewares/multer.js';
import { addMembersValidator, chatIdValidator, newGroupValidator, removeValidator, renameValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
const router=express.Router()

router.use(isAuthenticated) 
router.post('/new',newGroupValidator(),validateHandler,newGroupChat)
router.get('/my',getMyChats)
router.get('/my/groups',getMyGroups)
router.put('/add-members',addMembersValidator(),validateHandler,addMembers)
router.put('/remove-members',removeValidator(),validateHandler,removeMembers)
router.delete('/leave/:id',chatIdValidator(),validateHandler,leaveGroup)
router.post('/message',attachments,sendAttachmentsValidator(),validateHandler,sendAttachment)
router.post('/message/:id',chatIdValidator(),validateHandler,getMessages)
router.route('/:id').get(chatIdValidator(),validateHandler,getChatDetails)
.put(renameValidator(),validateHandler,renameGroup)
.delete(chatIdValidator(),validateHandler,deleteChat)
export default router