const asyncHandler =require("express-async-handler")

const {Category,validateCreatCategory}=require("../models/Category")
/**
 * @desc creat new category  
 * @Route /api/categories
 * @method Post
 * @access private (only admin) 
 * 
 */

module.exports.creatCategoryCtrl = asyncHandler(async (req, res) => {
    const {err}=validateCreatCategory(req.body);
    if(err){
        return res.status(400).json({message:err.details[0].message});
    }
   // console.log(req.user._id);
    const category= await Category.create({
        title:req.body.title,
        user:req.user._id,
    })
    res.status(201).json(category);
  
  });

  /**
 * @desc get all categories 
 * @Route /api/categories
 * @method GET
 * @access public 
 * 
 */

module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {

    const categories = await Category.find();
    if(!categories){
        return res.status(404).json({message:"categories not found"});
    }
    res.status(200).json(categories);
  
  });
  
    /**
 * @desc delete category
 * @Route /api/categories/:id
 * @method DELETE
 * @access private (only admin) 
 * 
 */

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
    
    const category = await Category.findById(req.params.id);
    console.log(category);
    if(!category){
        return res.status(404).json({message:"categories not found"});
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"deleted successfuly"});
  
  });
  
  