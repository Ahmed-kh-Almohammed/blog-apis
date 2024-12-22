const router =require("express").Router();

const { creatCategoryCtrl, getAllCategoriesCtrl, deleteCategoryCtrl } = require("../controllers/categoriesController");
const  {verifyTokenAndAdmin}=require("../middlwares.js/verifyToken");
const validateObjectId=require("../middlwares.js/validateObjectId");


router.route("/").post(verifyTokenAndAdmin,creatCategoryCtrl)
      .get(getAllCategoriesCtrl);

router.route("/:id").delete(validateObjectId,verifyTokenAndAdmin,deleteCategoryCtrl);

module.exports =router;