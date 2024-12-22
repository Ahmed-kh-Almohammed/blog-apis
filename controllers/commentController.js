const asyncHandler =require("express-async-handler");



const {Comment,validateCreatComment,validateUpdateComment}=require("../models/Comment");
const {User}=require("../models/User");
const { default: mongoose } = require("mongoose");




/**
 * @desc creat new comment  
 * @Route /api/comments
 * @method Post
 * @access private (only login user) 
 * 
 */

module.exports.creatCommentCtrl =asyncHandler(async(req,res)=>{
    const {error}=validateCreatComment(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const profile =await User.findById(req.user._id);

    const comment = await Comment.create({
        postId : req.body.postId,
        user :req.user._id,
        username:profile.username,
        text:req.body.text,
    })

    res.status(201).json(comment);



})



/**
 * @desc get All comments  
 * @Route /api/comments
 * @method GET
 * @access private (only Admin) 
 * 
 */

module.exports.getAllCommentCtrl =asyncHandler(async(req,res)=>{
  
    const comments =await Comment.find().populate("user");
    res.status(200).json(comments);
})


/**
 * @desc DELETE Comment 
 * @Route /api/comments/:id
 * @method DELETE
 * @access private (only Admin or the comment owner) 
 * 
 */

module.exports.deleteCommentCtrl =asyncHandler(async(req,res)=>{
  
    const comment =await Comment.findByIdAndDelete(req.params.id);
    if(!comment)return res.status(404).json({message:"comment not found"});
    if(comment.user.toJSON()===req.user._id||req.user.isAdmin)
    res.status(200).json({message:`comment ${comment.text} deleted successfuly`});
    else {
        return res.status(403).json({message:"access denied ,only Admin or owner of comment allow"})
    }
})

/**
 * @desc update comment 
 * @Route /api/comments/:id
 * @method put 
 * @access private (only owner of the comment) 
 * 
 */

module.exports.updateCommentCtrl =asyncHandler(async(req,res)=>{
    const {error}=validateUpdateComment(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const comment =  await Comment.findById(req.params.id);

    if(!comment){

        return res.status(404).json({message:"comment not found"});

    }
    console.log(req.user._id);
    console.log(comment.user.toString());
    if(req.user._id !==comment.user.toString()  ){

        return res.status(403).json({message:"access denied ,only user himself can edit his comment"});
    }
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id,{
        $set:{
           text: req.body.text,
        }
    },{
        new:true,
    })
    res.status(200).json(updatedComment);



})
