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
  
}



export default router;