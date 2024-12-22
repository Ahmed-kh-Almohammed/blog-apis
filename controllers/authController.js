const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRigsterUser, validateLoginUser } = require("../models/User");

/**
 * @desc Rigster new user 
 * @Route /api/auth/rigster
 * @method Post
 * @access public 
 * 
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {

    ///validation 
    const { error } = validateRigsterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
        ///error 400 bad request the problem form user ....
    }
    // is user already exist 
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "user is already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "register successfuly please login..." });


})

/**
 * @desc login user 
 * @Route /api/auth/login
 * @method Post
 * @access public 
 * 
 */


module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    //validation
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
        ///error 400 bad request the problem form user ....
    }
    //is user exist 
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "invalid email" });
    }

    // check password
      isPasswordMatch=await bcrypt.compare(req.body.password,user.password);
      if(!isPasswordMatch){
        return res.status(400).json({ message: "invalid password" });
      }
    // generate token 
    const token=await user.generateAuthToken();
    res.status(200).json({
        isAdmin:user.isAdmin,
        _id:user._id,
        profilePhoto:user.profilePhoto,
        token
    })
    // response to client

})