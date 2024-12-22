const mongoose=require("mongoose");
const joi=require("joi");
const jwt= require("jsonwebtoken");
const UserSchema= new mongoose.Schema({
           username :{
             type :String ,
             trim:true,
             required :true,
             minlength:2,
             maxlength:100
           } ,

          email :{
            type :String ,
            trim:true,
            required :true,
            unique:true,
            minlength:4,
            maxlength:100
          } 
          ,
          password :{
            type :String ,
            trim:true,
            required :true,
            minlength:8,
          } ,
          profilePhoto : {
            type : Object,
            default:{
               
            url : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
                ,
            publicId :null
            }
          },
          bio:{
             type :String 
          },
          isAdmin : {
            type :Boolean,
            default :false
          }
          ,
          isAccountVerified : {
            type :Boolean,
            default :false
          }

},{
    timestamps :true ,
    toJSON : {virtuals :true },
    toObject :{virtuals :true },
    
});

UserSchema.virtual("posts",{
  ref:"Post",
  foreignField :"user",
  localField :"_id",
})


//generate token 

UserSchema.methods.generateAuthToken=function(){
            
  return jwt.sign({_id:this._id,isAdmin:this.isAdmin},process.env.SECRET_KEY);
}

///validate rigster

function validateRigsterUser(obj){
    const Schema = joi.object({
              username : joi.string().trim().min(2).max(100).required(),
              email :joi.string().trim().min(4).max(100).required(),
              password : joi.string().trim().min(8).required(), 

    })
    return Schema.validate(obj);
}


/// validate login 

function validateLoginUser(obj){
         const schema= joi.object({
           email: joi.string().trim().min(4).max(100).required(),
           password: joi.string().trim().min(8).required()
         })
         return schema.validate(obj);

}

/// validate updated user 

function validateUpdatedUser(obj){
  const schema= joi.object({
  
    password: joi.string().trim().min(8),
    username : joi.string().trim().min(2).max(100),
    bio : joi.string()
  })
  return schema.validate(obj);

}


const User = mongoose.model("User",UserSchema);

module.exports = {User,validateRigsterUser,validateLoginUser,validateUpdatedUser}