const express = require('express')
const router = express.Router()

// import mongoose to send data to database
const mongoose = require('mongoose')
const User = mongoose.model("User")

// import tool for hashing the password
const bcrypt = require('bcrypt')

// import token generation tool
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

/* router.get('/', (req, res)=>{
    res.send("Hello Ruben")
}) */
router.get('/protected', requireLogin, (req,res)=>{
    res.send("Hello Ruben, the day is bright and fair oh happy day")
})
router.post('/signup', (req, res) => {
    const {name, email, password, pic} = req.body
    if(!email || !password || !name){
       return res.status(422).json({error:"Please fill all the fields"})
    }
    // mongodb
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
           return res.status(422).json({error:"user already exists with that email"})
        }
        // hash the password
        bcrypt.hash(password, 12)
        .then(hashedpassword =>{
            // create an instance of User
            const user = new User({
                email,
                password: hashedpassword,
                name,
                pic
            })

            // store instance of user
            user.save()
            .then(user =>{
                res.json({message:"saved successfully"})
            })
            .catch(err =>{
                console.log(err)
            })
        })
        
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post('/signin',(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"invalid Email orpassword"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
                
                // create a token
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id, name, email,followers,following,pic} = savedUser
                res.json({token, user:{_id, name, email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})
module.exports = router


//NOTE
/*Hash the password with bcrypt.js
npm install bcrypt */

/*
If user is sign in he must be given a token to access
protected resource

npm istall jsonwebtoken
*/