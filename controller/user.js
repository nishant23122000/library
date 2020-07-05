const Locker=require('../models/locker')
const Book=require('../models/book')
var current;
exports.getLocker=(req,res,next)=>{
    console.log(req.session.user)
    Locker.findOne({userId:req.user}).then((locker)=>{
        locker.books.forEach((book)=>{
            current =new Date().getTime();
            var issuetime=parseInt(book.issueDate)
            var limit=issuetime+800000
            // console.log(current)
            // console.log(issuetime)
            // console.log(e)
           
            // console.log(current-issuetime)
            // console.log(book.bookId)
         if(current>limit){
            Locker.deleteLocker(req.user,{bookId:book.bookId}).then(()=>{
                console.log('BOOK DELETED DUE TO OVERDATE')
            })
         
        }
        
            
        })
    })
    Locker.findOne({userId:req.user}).populate('books.bookId').then((locker)=>{
        
        res.render('user/locker',{
            pageTitle:'locker',
            books:locker ? locker.books : null,
            locker:true,
            path:'/locker'
            

        })
    })
}

exports.addToLocker=(req,res,next)=>{
    const bookId=req.params.bookId
        Locker.addToLocker(bookId,req.user).then(()=>{
                res.redirect('/locker')
            })
        
}

exports.deleteFromLocker=(req,res,next)=>{

    Locker.deleteLocker(req.user,req.params).then(()=>{
        req.flash('delete','book deleted from locker')
        res.redirect('/')
    })
   
}