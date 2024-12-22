const asyncHandler = require("express-async-handler");
const {User, validateUpdatedUser}=require("../models/User");
const bcrypt = require("bcryptjs");
const path =require("path");
const fs=require("fs");
const {cloudinaryRemoveImage,cloudinaryUploadImage,cloudinaryRemoveMultipleImage}=require("../utils/cloudinary");

const {Comment}=require("../models/Comment");
const { Post }=require("../models/Post");

/**
 * @desc get All useres 
 * @Route /api/users/profile
 * @method GET
 * @access private (only admin) 
 * 
 */

module.exports.getAlluserCtrl=asyncHandler(async(req,res)=> {
          const users= await User.find().select("-password");
          res.status(200).json(users);
         
});

/**
 * @desc get user profile  
 * @Route /api/users/profile /:id 
 * @method GET
 * @access public by user 
 * 
 */
module.exports.getUserProfileCtrl=asyncHandler(async(req,res)=> {
    const user= await User.findById(req.params.id).select("-password").populate("posts");
    if(!user){
        return res.status(400).json({message:"no user exist"});
    }
    res.status(200).json(user);
   
});

/**
 * @desc  update user profile  
 * @Route /api/users/profile /:id 
 * @method put
 * @access private ( by login user or by admin)
 * 
 */
module.exports.updateUserProfileCtrl=asyncHandler(async(req,res)=> {
       const {error}=validateUpdatedUser(req.body);
       if(error){
        return res.status(400).json({message:error.details[0].message});
       }
       if(req.body.password){
          const salt= bcrypt.genSalt(10);
          req.body.password =await bcrypt.hash(req.body.password,salt);
       }

       const user= await User.findByIdAndUpdate(req.params.id,{
          $set:{
             username : req.body.username,
             password : req.body.password,
             bio : req.body.bio
          }
       },{new: true}).select("-password");

       await user.save();
       res.status(200).json(user);
   
});

/**
 * @desc get users count
 * @Route /api/users/profile
 * @method GET
 * @access public 
 * 
 */

module.exports.getCounterOfUser=asyncHandler(async(req,res)=> {
    const CountOfUser= await User.countDocuments();
    console.log(CountOfUser);
    res.status(200).json(CountOfUser);
   
});

/**
 * @desc upload profile photo 
 * @Route /api/users/profile/upload-photo
 * @method post
 * @access private (only login user) 
 * 
 */
module.exports.uploadProfilePhotoCtrl=asyncHandler(async(req,res)=>{
    //1.validation
    if(!req.file)return res.status(400).json({message: "no file provided "});

    //2.get the path to the image 
    const imagePath= path.join(__dirname,`../images/${req.file.filename}`);
   // console.log(imagePath);
    //3.upload the cloudinary
    const result= await cloudinaryUploadImage(imagePath);
    console.log(result);
    //4.get the user from DB
    const user= await User.findById(req.user._id);
    //5.delete the old profile photo if exist

    if(user.profilePhoto.publicId!==null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    //6.change the profile in the DB
    user.profilePhoto = {
        url : result.secure_url,
        publicId:result.public_id
    }
    await user.save();
    //7.send response to client
    res.status(200).json({
        message:"your profile phtot uploaded successfully",
        profilePhoto : {
            url : result.secure_url,
            publicId:result.public_id
        }
    });
    //8. remove the image form the server
    fs.unlinkSync(imagePath);

})

/**
 * @desc Delete user  profile( Acount) 
 * @Route /api/users/profile/:id
 * @method DELETE
 * @access private (only Admin or user himself) 
 * 
 */

module.exports.DeleteUserProfileCtrl= asyncHandler(async(req,res)=>{
     //1. get user from database
     const user= await User.findById(req.params.id);
     if(!user){
        return res.status(404).json({message :"user not found"});
     }
     //- 2.get all posts from database
      const posts =await Post.find({user:user._id});
     // 3.get the public ids from posts
     const publicIds = posts?.map((post)=>post.image.publicId) ;
     // - 4.delet all posts images from cloudinary that belong to this user 
        if(publicIds?.length> 0)
         await  cloudinaryRemoveMultipleImage(publicIds);
     //5. delete the profile picture from cloudinary 
      await cloudinaryRemoveImage(user.profilePhoto.publicId);


     // 6. delete  users post and comment 

     await Post.deleteMany({user:user._id});
     await Comment.deleteMany({user:user._id});

     //7. delete user himself 
     await User.findByIdAndDelete(req.params.id);

     //8.send a respons to  a client 
     res.status(200).json({message:"your profile has been deleted"});
})