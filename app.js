const express = require('express')
const app = express()

//---------Connect to database------------------------
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')

require('./models/user')
require('./models/post')

// convert all request to json
app.use(express.json())

// register route
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


mongoose.connect(MONGOURI,{
    // add this to prevent error
    useNewUrlParser: true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeah")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connection",err)
})
//------------End---------------------------------------

app.get('/',(req,res)=>{
    res.send("Hello world")
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log("Server is running on", PORT)
})