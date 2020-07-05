const mongoose=require('mongoose')

const Schema=mongoose.Schema

const userSchema=new Schema({
   
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    resetToken:String,
    resetTokenExpireDate:Date
})

userSchema.methods.checkUser=function(){
    
}
module.exports=mongoose.model('User',userSchema)

