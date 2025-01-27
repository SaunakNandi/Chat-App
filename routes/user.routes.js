import express from 'express';
import { login, newUser, getMyProfile, logout, searchUser, sendFrndReq, getMyNotifications, acceptFrndReq, getMyFriends } from '../controllers/user.controller.js';
import {singleAvatar} from '../middlewares/multer.js';
import {isAuthenticated} from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../lib/validators.js';
const router=express.Router()
// in video it is done as app=express.Router()

router.post('/login',loginValidator(),validateHandler,login)
router.post('/new',singleAvatar,registerValidator(),validateHandler,newUser)


router.use(isAuthenticated) // serving as middleware
// router.get('/me',isAuthenticated,getMyProfile)
router.get('/me',isAuthenticated,getMyProfile)
router.get('/logout',logout)
router.get('/search',searchUser)
router.put('/send-req',sendRequestValidator(),validateHandler,sendFrndReq)
router.get('/notifications',getMyNotifications)
router.put('/accept-req',acceptRequestValidator(),validateHandler,acceptFrndReq)
router.get('/friends',getMyFriends)
export default router