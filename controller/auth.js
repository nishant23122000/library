const User=require('../models/user')
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const transper=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'email',
        pass:'password'
    }
})
exports.getSignUp=(req,res,next)=>{
    res.render('auth/signup',{
        path:'/signup',
        pageTitle:'signup',
        errorMsg:req.flash('already')
        
        
    })
}
exports.postSignUp=(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    const confirmPassword=req.body.confirmPassword
    

    User.findOne({email:email}).then((userDoc)=>{
        if(userDoc){
            req.flash('already','Email Id is already taken!')
            return res.redirect('/signup')
        }
       return bcrypt.hash(password,12).then((hashPassword)=>{
            const user=User({
                email:email,
                password:hashPassword
            })
            return user.save()
        }).then(()=>{
            req.flash('sucess','Your Account Created💕💕')
            res.redirect('/login')
            transper.sendMail({
                to:email,
                from:'email',
                subject:'Sigged Up Successfully',
                text:'welcome to Book Library,Post Your own book and share among all users😉'
            })
        })

    })
}
exports.getLogin=(req,res,next)=>{
   
    res.render('auth/login',{
        pageTitle:'login',
        path:'/login',
        errorMsg:req.flash('sucess')
        
        
        
                
    })
}

exports.postLogin=(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    User.findOne({email:email}).then((user)=>{
        if(!user){
            req.flash('loginerror','Either Email or Password incorrect!😢')
            return res.redirect('/signup')
        }
        bcrypt.compare(password,user.password).then((isMatch)=>{
            if(isMatch){
                req.session.loggedIn=true
                req.session.user=user
                
                return req.session.save((err)=>{
                    console.log(err)
                    res.redirect('/')    
                })
            }
            res.redirect('/signup')
        }).catch((error)=>{
            console.log(error)
            res.redirect('/signup')
        })
    })
}

exports.getResetPassword=(req,res,next)=>{
    res.render('auth/reset_password',{
        pageTitle:'reset password',
        path:'/reset'

    })
}
exports.postResetPassword=(req,res,next)=>{
    const email=req.body.email
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/signup')
        }
        const token=buffer.toString('hex')
        User.findOne({email:email}).then((user)=>{
            if(!user){
                req.flash('wronguser','invalid email id')
                return res.redirect('/signup')
            }
            user.resetToken=token
            user.resetTokenExpireDate=Date.now()+3600000
            return user.save()
           
    
        }).then(()=>{
            req.flash('sucess','check Your mail')
            res.redirect('/login')
            return transper.sendMail({
                to:email,
                from:'email',
                subject:'reset password',
                html:'<h1>you requested to change password click this<a href="http://localhost:3000/reset/'+token+'"> link</a></h1>'
            }).catch((error)=>{
                console.log(error)
            })
        }).catch((error)=>{
            console.log(error)
            res.redirect('/signup')
        })
    })
   

}

exports.logOut=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}
exports.getNewPassword=(req,res,next)=>{
    const token=req.params.token
    User.findOne({resetToken:token,resetTokenExpireDate:{$gt :Date.now()}}).then((user)=>{
       console.log(user)
        res.render('auth/new_password',{
            pageTitle:'new password',
            token:token,
            userId:user._id.toString()
        })
    }).catch((err)=>{
        console.log(err)
    })
}

exports.postNewPassword=(req,res,next)=>{
    const password=req.body.password
    const userId=req.body.userId
    const token=req.body.token
    let resetuser;
    User.findOne({
        resetToken:token,
        resetTokenExpireDate:{$gt: Date.now()},
        _id:userId
    }).then((user)=>{
        resetuser=user
            return bcrypt.hash(password,12)
    }).then((hashedPassword)=>{
        resetuser.password=hashedPassword
        resetuser.resetToken=undefined
        resetuser.resetTokenExpireDate=undefined
        return resetuser.save()
    }).then(()=>{
        req.flash('sucess','password change successfully✨')
        res.redirect('/login')
    }).catch((err)=>{
        console.log(err)
    })
}