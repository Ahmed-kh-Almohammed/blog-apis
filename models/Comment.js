const mongoose =require("mongoose");
const joi =require("joi");


const CommentSchmea = new mongoose.Schema({
            
      postId :{
        type :mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true"
      },
      text:{
        type:String ,
        required:true,
      },
      username:{
        type :String ,
        required:true,
      }

},{
    timestamps:true,

}) 

const Comment = mongoose.model("Comment",CommentSchmea);


//validate Create Commnet 

function validateCreatComment(obj){
    const schema = joi.object({
        postId: joi.string().required().label("Post ID"),
        text: joi.string().trim().required().label("your comment"),

    })
    return schema.validate(obj);
}

//validate update  Commnet 

function validateUpdateComment(obj){
    const schema = joi.object({
        text: joi.string().required(),

    })
    return schema.validate(obj);
}

module.exports ={
    Comment,
    validateCreatComment,
    validateUpdateComment,
}