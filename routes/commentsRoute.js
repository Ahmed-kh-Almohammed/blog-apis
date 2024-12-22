const router =require("express").Router();
const {verifyToken, verifyTokenAndAdmin, verifyTokenUserhimselfOrAdmin}=require("../middlwares.js/verifyToken");
const validateObjectId = require("../middlwares.js/validateObjectId");
const { creatCommentCtrl, getAllCommentCtrl, deleteCommentCtrl, updateCommentCtrl } = require("../controllers/commentController");


router.route("/").post(verifyToken,creatCommentCtrl)
                 .get(verifyTokenAndAdmin,getAllCommentCtrl);


router.route("/:id").delete(validateObjectId,verifyToken,deleteCommentCtrl)
                    .put(validateObjectId,verifyToken,updateCommentCtrl);

module.exports =router;