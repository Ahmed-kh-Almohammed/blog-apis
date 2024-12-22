const mongoose =require("mongoose");
const joi =require("joi");

/// category schema
const categorySchema = new mongoose.Schema({
            
  
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true"
      },
      title:{
        type:String ,
        required:true,
        trim:true,
      }

},{
    timestamps:true,
}) 

const Category = mongoose.model("category",categorySchema);


//validate Create Category 

function validateCreatCategory(obj){
    const schema = joi.object({
        title: joi.string().required().label("title"),
    })
    return schema.validate(obj);
}



module.exports ={
    Category,
    validateCreatCategory,

}