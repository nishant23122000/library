const Book=require('../models/book')
const ObjectId=require('mongodb').ObjectId
exports.getBooks=(req,res,next)=>{

 
    console.log(req.flash('delete'))
   Book.find()
   .then((books)=>{
    res.render('user/locker',{pageTitle:'books',books:books,locker:false,path:'/book'})
   }).catch((error)=>{
       console.log(error)
   })
    
}
exports.getAddBook=(req,res,next)=>{
   res.render('book/edit_book',{pageTitle:'add',edit:false,book:0,path:'/add'})
}

exports.postAddBook=(req,res,next)=>{
    const title=req.body.title
    const author=req.body.author
    const copies=req.body.copies
    const price=req.body.price
    const description=req.body.description
    const imageUrl=req.body.imageUrl
    const book=new Book({
        title:title,
        author:author,
        copies:copies,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId:req.user
    })
    book.save().then((book)=>{
        console.log(book)
        res.redirect('/')
    }).catch((error)=>{
        console.log(error)
    })
 }

 exports.getEditDeletBook=(req,res,next)=>{
    Book.find({userId:req.user})
    .then((books)=>{
        res.render('book/edit',{pageTitle:'edit',books:books,path:'/edit'})
    }).catch((error)=>{
        console.log(error)
    })
    
 }

 exports.getEditBook=(req,res,next)=>{
     Book.findById(req.params.bookId).then((book)=>{
         res.render('book/edit_book',{pagetitle:'edit_book',book:book,edit:true,path:'/edit'})
     }).catch((error)=>{
         console.log(error)
     })

 }

 exports.postEditBook=(req,res,next)=>{
    const bookId=new ObjectId(req.body.id)
    const updatedcopies=req.body.copies
    const updatedprice=req.body.price
    const updatedDescription=req.body.description
    const updatedImageUrl=req.body.imageUrl
    Book.findById(bookId).then((book)=>{
        book.copies=updatedcopies
        book.price=updatedprice
        book.description=updatedDescription
        book.imageUrl=updatedImageUrl
        return book.save()
    }).then(()=>{
        console.log('BOOK UPDATED')
        res.redirect('/')
    })

 }

 exports.deleteBook=(req,res,next)=>{
        Book.deleteOne({_id:req.params.bookId}).then((result)=>{
            console.log('BOOK DELETED')
            res.redirect('/')
        })
 }