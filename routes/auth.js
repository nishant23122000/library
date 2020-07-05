const express=require('express')
const authController=require('../controller/auth')
const router=express.Router()

router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)
router.get('/signup',authController.getSignUp)
router.post('/signup',authController.postSignUp)
router.get('/logout',authController.logOut)
router.get('/reset',authController.getResetPassword)
router.post('/reset',authController.postResetPassword)
router.get('/reset/:token',authController.getNewPassword)
router.post('/new_password',authController.postNewPassword)
module.exports=router