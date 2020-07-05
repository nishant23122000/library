const mongoose=require('mongoose')

const Schema=mongoose.Schema

const bookSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
    },
    copies:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        require:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }

})

module.exports=mongoose.model('Book',bookSchema)

