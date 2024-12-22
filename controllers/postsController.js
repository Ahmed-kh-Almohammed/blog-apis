const fs = require("fs")
const path = require("path")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { Post, validateCreatPost, validateUpdatePost } = require("../models/Post");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const { uploadProfilePhotoCtrl } = require("./usersController");
const {Comment}=require("../models/Comment");


/**
 * @desc creat new post  
 * @Route /api/posts
 * @method Post
 * @access private (only login user) 
 * 
 */

module.exports.creatPostCtrl = asyncHandler(async (req, res) => {
  //1. validation for Image
  if (!req.file) {
    return res.status(400).json({ message: "NO image  provided" });
  }
  //2. validation for data
  const { error } = validateCreatPost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //3.  upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
  const result = await cloudinaryUploadImage(imagePath);
  //4. creat new post and save it into DB
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user._id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    }
  })
  //5. send response to the client
  res.status(200).json(post);
  //6. remove image from the server
  fs.unlinkSync(imagePath);

});

/**
 * @desc get All posts
 * @Route /api/posts
 * @method GET
 * @access public 
 * 
 */
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  post_per_page = 3;
  const { pageNumber, category } = req.query;

  let posts;
  if (pageNumber) {
    posts = await Post.find().skip((pageNumber - 1) * post_per_page)
      .limit(post_per_page).sort({ createdAt: -1 }).populate("user", ["-password"]);
  }
  else if (category) {
    posts = await Post.find({ category }).sort({ createdAt: -1 }).populate("user", ["-password"]);
  }
  else {
    posts = await Post.find().sort({ createdAt: -1 }).populate("user", ["-password"]);
  }
  res.status(200).json(posts);

})

/**
 * @desc get post by id 
 * @Route /api/posts/:id
 * @method GET
 * @access public 
 * 
 */
module.exports.getSingePostCtrl = asyncHandler(async (req, res) => {

  const post = await Post.findById(req.params.id).populate("user", ["-password", "-isAdmin"]).populate("comments");
  if (!post) {
    return res.status(404).json({ message: "post not found " })
  }
  res.status(200).json(post);

})
/**
 * @desc get count Posts
 * @Route /api/posts/count
 * @method GET
 * @access public 
 * 
 */
module.exports.getCountPostCtrl = asyncHandler(async (req, res) => {

  const postCount = await Post.countDocuments();
  res.status(200).json(postCount);

})

/**
 * @desc delete post by id 
 * @Route /api/posts/:id
 * @method DELETE
 * @access private (only admin or owner of the post) 
 */
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found " })
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findOneAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.publicId);
    
    // delete all comment
    await Comment.deleteMany({postId:post._id})

    return res.status(200).json({ message: `post with id ${post.id} has been deleted successfly ` });
  }
  else {
    return res.status(403).json({ message: "access denied , forbiden " });
  }

})

/**
 * @desc update post by id 
 * @Route /api/posts/:id
 * @method put
 * @access private (owner of the post) 
 * 
 */
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {

  // 1.validation 
  const { error } = validateUpdatePost(req.body);

  if (error) {
    return res.status(400).json({ message: "invalid updated data " });
  }
  //2 . get the post from DB
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  //3. check if the owner 
  if (req.user._id !== post.user.toString()) {
    return res.status(403).json({ message: "access denied you are nod allowed" });
  }
  //4. update the post

  const updpost = await Post.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category
    }
  }, { new: true }).populate("user", ["-password"]);
  res.status(200).json(updpost);
})


/**
 * @desc update post image 
 * @Route /api/posts/update-image/:id
 * @method put
 * @access private (owner of the post) 
 */

module.exports.updateImagePostCtrl = asyncHandler(async (req, res) => {


  // 1.validation 
  if (!req.file) {
    return res.status(400).json({ message: "no image provided " });
  }
  //2 . get the post from DB
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  //3. check if the owner 
  console.log(req.user);
  if (req.user._id !== post.user.toString()) {
    return res.status(403).json({ message: "access denied you are nod allowed" });
  }
  //4. delete the old image 
  await cloudinaryRemoveImage(post.image.publicId);

  //5. upload new photo 
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  //6. update image in the DB
  const updImagepost = await Post.findByIdAndUpdate(req.params.id, {
    $set: {
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      }
    }
  }, { new: true });


  res.status(200).json(updImagepost);

  fs.unlinkSync(imagePath);
})

/**
 * @desc Taggle like 
 * @Route /api/posts/like/:id
 * @method put
 * @access private (private only login user) 
 */

module.exports.taggleLikeCtrl = asyncHandler(async (req, res) => {


  const loggedInUser = req.user._id;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  
   const isPostAlreadyLiked= post.likes.find((user)=>user.toString()===loggedInUser);
   
   console.log("isPostAlreadliked = ",isPostAlreadyLiked);
   if(isPostAlreadyLiked){
        post =await Post.findByIdAndUpdate(postId,{
          $pull : {
            likes:loggedInUser,
          }
        },{new:true});
   }
   else {
      post =await Post.findByIdAndUpdate(postId,{
        $push:{
          likes:loggedInUser,
        }
      },{new:true});
   }

   res.status(200).json(post);


})


