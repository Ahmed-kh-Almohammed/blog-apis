const mongoose= require("mongoose");
const joi=require("joi");


const PostSchema= new mongoose.Schema({
           title : {
            type :String ,
            required :true,
            trim :true,
            minlength :2,
            maxlength :100,

           },

           description : {
            type :String ,
            required :true,
            trim :true,
            minlength :10,

           },
           user :{
            type: mongoose.Schema.Types.ObjectId,
            ref :"User",
            required :true,

           },
           category :{
             type :String ,
             required :true,
           },
           image :{
             type :Object,
             default:{
                url :"",
                publicId :null
             }
           },
           likes:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref :"User",

            }
           ]
},{timestamps:true ,
    toJSON :{virtuals:true},
    toObject:{virtuals:true}
})
PostSchema.virtual("comments",{
    ref:"Comment",
    foreignField:"postId",
    localField : "_id",


})

const Post = mongoose.model("Post",PostSchema);

function  validateCreatPost(Obj){
    const Schema =joi.object({
        title : joi.string().trim().min(2).max(100).required(),
        description :joi.string().trim().min(10).required(),
        category :joi.string().required(),

    })
    return Schema.validate(Obj);
}

function  validateUpdatePost(Obj){
    const Schema =joi.object({
        title : joi.string().trim().min(2).max(100),
        description :joi.string().trim().min(10),
        category :joi.string(),

    })
    return Schema.validate(Obj);
}

module.exports ={
    Post,
    validateCreatPost,
    validateUpdatePost
}
