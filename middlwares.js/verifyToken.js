
const jwt=require("jsonwebtoken");

function verifyToken(req,res,next){
        const authToken=req.headers.authorization;

        if(authToken){
              
            const token=authToken.split(" ")[1];
            try {
                const payload= jwt.verify(token,process.env.SECRET_KEY );
                req.user=payload;
                next();
            } catch (error) {
                return res.status(401).json({message:"invalid token access denied"});
            }
            

        } else {
            console.log("no token provided");
           return  res.status(401).json({message:"no token provided"});
        }

}
function verifyTokenAndAdmin(req,res,next){
          verifyToken(req,res,()=>{
          if(!req.user.isAdmin){
            return res.status(401).json({message:"you are not admin only admin alllowed"});
          }
          next();
        });

}

function verifyTokenAndLoginUser(req,res,next){
    verifyToken(req,res,()=>{
    //console.log(req.user);
//    console.log(req.params.id);
    if((req.user._id===req.params.id)){
        next();
    }
    else 
    return res.status(401).json({message:"not allowed only login user allowed"});
    
  });

}

function verifyTokenUserhimselfOrAdmin(req,res,next){
    verifyToken(req,res,()=>{
    //console.log(req.user);
//    console.log(req.params.id);
    if((req.user._id===req.params.id||req.user.isAdmin)){
        next();
    }
    else 
    return res.status(401).json({message:"not allowed only userhimself  or Admin allowed "});
    
  });

}

module.exports= {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndLoginUser,
    verifyTokenUserhimselfOrAdmin,
};