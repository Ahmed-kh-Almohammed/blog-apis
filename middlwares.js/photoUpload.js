const path =require("path");
const multer=require("multer");

const phtotStorage =multer.diskStorage({

        destination :function(req,file,cb){

            const zz=path.join(__dirname,"../images");
      
            cb(null,zz);
        }
        ,
        filename : function(req,file,cb){
            if(file){
                cb(null,new Date().toISOString().replace(/:/,"-")+file.originalname);
            }
            else {
                cb(null,false);
            }
        }
})

///photo upload middleware 

const photoUpload = multer({
    storage : phtotStorage,
    fileFilter : function(req,file, cb){
        if(file.mimetype.startsWith("image")){
               cb(null,true);
        }
        else {
               cb({message : "only images allowed "},false);
        }
    }
    ,limits : {fileSize : 1024*1024 *5}
})

module.exports =photoUpload;