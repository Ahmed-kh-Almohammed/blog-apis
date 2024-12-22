const express =require("express");
const { getAlluserCtrl, getUserProfileCtrl,updateUserProfileCtrl, getCounterOfUser, uploadProfilePhotoCtrl, DeleteUserProfileCtrl } = require("../controllers/usersController");
const { version } = require("joi");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndLoginUser, verifyTokenUserhimselfOrAdmin } = require("../middlwares.js/verifyToken");
const validateObjectId=require("../middlwares.js/validateObjectId");
const photoUpload = require("../middlwares.js/photoUpload");
const router=express.Router();

router.route("/profile").get(verifyTokenAndAdmin,getAlluserCtrl);
                        
router.route("/profile/:id").get(validateObjectId,getUserProfileCtrl)
                            .put(validateObjectId,verifyTokenAndLoginUser,updateUserProfileCtrl)
                            ///not try to excute this controller if there are a problem about it go to video 09
                            .delete(validateObjectId,verifyTokenUserhimselfOrAdmin,DeleteUserProfileCtrl);

router.route("/count").get(verifyTokenAndAdmin,getCounterOfUser);

router.route("/profile/upload-photo").post(verifyToken,photoUpload.single("image"),uploadProfilePhotoCtrl);

module.exports =router;