const express=require('express')
const userController=require('../controller/user')
const router=express.Router()
const isAuth=require('../middleware/isAuth')

router.get('/locker',isAuth,userController.getLocker)
router.get('/add-locker/:bookId',isAuth,userController.addToLocker)
router.get('/delete_from_locker/:bookId',isAuth,userController.deleteFromLocker)
module.exports=router