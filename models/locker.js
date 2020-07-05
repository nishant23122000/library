const mongoose=require('mongoose')
const Book=require('../models/book')

const Schema=mongoose.Schema

const lockerSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    books:[
        {
            bookId:{
                type:Schema.Types.ObjectId,
                ref:'Book',
                required:true,
            },
            issueDate:{
                type:String,
                default:new Date().getTime()
                 }
        }
    ]

})

lockerSchema.statics.addToLocker=function(bookId,userId){
    return Locker.findOne({userId:userId}).then((locker)=>{
      
        if(locker)
        {
          
            const bookIds=locker.books.map((book)=> book.bookId)
            const id=bookIds.find((id)=>id.toString()===bookId.toString())
            
            if(!id)
            {
                let books=[]
                bookIds.push(bookId)
                bookIds.forEach((id)=>{
                    books.push({
                        bookId:id
                    })
                })
                locker.books=books
               return locker.save().then(()=>{
                    Book.findById(bookId).then((book)=>{
                        const copie=book.copies
                        const ans=copie-1
                        book.copies=ans
                        console.log(book.copies)
                        book.save()
                    })
                })
                
            }
          
            
            
        }else{
          
            const locker=new Locker({
                userId:userId,
                books:[
                    {
                    bookId:bookId
                    }
                ]
                
        })
        return locker.save().then(()=>{
            Book.findById(bookId).then((book)=>{
                const copie=book.copies
                const ans=copie-1
                book.copies=ans
                console.log(book.copies)
                book.save()
            })
        })
       
        }
       
    })
}
lockerSchema.statics.deleteLocker=function(man,manbook){
    let bookid;
    let userId
    console.log(manbook)
   return  Locker.findOne({userId:man}).then((user)=>{
        userId=user.userId
        bookid=user.books.find((id)=>id.bookId.toString()===manbook.bookId.toString())
        
          Book.findById({_id:bookid.bookId}).then((book)=>{
            let copi=book.copies
            copi=copi+1
            book.copies=copi
            return book.save()
        }).then(()=>{
            
                Locker.findOne({userId:userId}).then((locker)=>{
                    const books=locker.books.find((id)=>id.bookId.toString()!==bookid.bookId.toString())
                    locker.books=books
                    return locker.save()
                         
                })
        })
    })    
  
}
Locker=mongoose.model('Locker',lockerSchema)
module.exports=Locker