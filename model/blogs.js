const mongoose=require("mongoose");

const BlogSchema=mongoose.Schema({

    title:{type:String,required:true},
    category:{type:String,required:true},
    author:{type:String,required:true},
    content:{type:String,required:true},
    user_id:{type:String,required:true},
   

})



const BlogModel=mongoose.model("blog",BlogSchema)

module.exports={BlogModel}