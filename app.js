const express=require('express')
const path=require('path')
const session=require('express-session')
const MongoSession=require('connect-mongodb-session')(session)
const flask=require('connect-flash')
const bodyparser=require('body-parser')
const bookRoutes=require('./routes/book')
const userRoutes=require('./routes/user')
const authRoutes=require('./routes/auth')
const mongoose=require('mongoose')

const User=require('./models/user')
const MONGODB_URL='mongodb://localhost:27017'

const app=express()
const store=new MongoSession({
    uri:MONGODB_URL,
    collection:'sessions',
})
app.use(flask())

app.set('view engine','ejs')
app.set('views','views')

app.use(session({secret:'patel',resave:false,saveUninitialized:false,store:store}))

app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'./public')))

app.use((req,res,next)=>{
    if(!req.session.user){
        return next()
    }
    User.findOne(req.session.user._id).then((user)=>{
        
        req.user=user
        next()
    })
})
app.use((req,res,next)=>{
    res.locals.isAuth=req.session.loggedIn
  
    
    next()
})

app.use(bookRoutes)
app.use(userRoutes)
app.use(authRoutes)

mongoose.connect(MONGODB_URL, {useNewUrlParser: true,useUnifiedTopology: true}).then((result)=>{
    
    app.listen(3000,()=>{
        console.log('server started on port 3000!')
    })
}) 


