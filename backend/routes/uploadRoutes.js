import path from "path";
import express from 'express';

import multer from "multer";

const router=express.Router();
// set the storage for the file
const storage=multer.diskStorage({
  destination(req,file,cb){
    cb(null,"uploads/");  //null is for the error
  },
  filename(req,file,cb){
    cb(null,`${file.fieldname}-${Date.now()}${path.extname(file,originalname)}`);
  },

});

// check the file type of the upload

function checkFileType(file,cb){
  const filetypes=/jpg|jpeg|png/;
  const extname= filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype=filetypes.test(file.mimetype);
  if(extname && mimetype){
    return cb(null,true);
  }else{
    cb("Image file only!");
  }
}

const upload=multer({
  storage,
})

// middleware for the single image uploading

router.post("/", upload.single("image"),(req,res)=>{
  res.send({
    message:"Image uploaded!",
    image:`/${req.file.path}`
  })
})



export default router;