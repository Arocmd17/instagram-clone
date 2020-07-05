const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        //default: "no photo"
        required: true
    },
    likes:[{type:ObjectId, ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    // establish relationship between post and user
    postedBy:{
        type: ObjectId,
        ref: "User"    // ensure it is the same as the one in model
    }
},{timestamps:true})

mongoose.model("Post",postSchema)
