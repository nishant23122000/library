const express=require('express')
const isAuth=require('../middleware/isAuth')
const router=express.Router()

const bookController=require('../controller/book')
router.get('/',bookController.getBooks)
router.get('/add_book',isAuth,bookController.getAddBook)

router.post('/add_book',bookController.postAddBook)
router.get('/edit_delete',isAuth,bookController.getEditDeletBook)
router.get('/edit/:bookId',isAuth,bookController.getEditBook)
router.post('/edit_book',bookController.postEditBook)
router.get('/delete/:bookId',isAuth,bookController.deleteBook)
module.exports=router