
const express =require("express");
const router=express.Router();
const {registerUserCtrl, loginUserCtrl}=require("../controllers/authController");


router.post("/register",registerUserCtrl)
      .post("/login",loginUserCtrl);

module.exports = router;