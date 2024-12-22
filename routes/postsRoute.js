const router =require("express").Router();
const { creatPostCtrl, getAllPostsCtrl, getSingePostCtrl, getCountPostCtrl, deletePostCtrl, updatePostCtrl, updateImagePostCtrl, taggleLikeCtrl } = require("../controllers/postsController");
const photoUpload =require("../middlwares.js/photoUpload");
const {verifyToken}=require("../middlwares.js/verifyToken");
const validateObjectId = require("../middlwares.js/validateObjectId");


// api/posts
router.route("/")
        .post(verifyToken,photoUpload.single("image"),creatPostCtrl)
        .get(getAllPostsCtrl)
        

//api/post/count
 router.route("/count").get(getCountPostCtrl);


// api/posts/:id
 router.route("/:id")
        .get(validateObjectId,getSingePostCtrl)
        .delete(validateObjectId,verifyToken,deletePostCtrl)
        .put(validateObjectId,verifyToken,updatePostCtrl);

        

// api/posts/update-image/:id 

router.route("/update-image/:id")
 .put(validateObjectId,verifyToken,photoUpload.single('image'),updateImagePostCtrl)

 

 // api/posts/like/:id
router.route("/like/:id")
.put(validateObjectId,verifyToken,taggleLikeCtrl);



module.exports =router;