import path from "path";
import { randomUUID } from "crypto";
import express from 'express';

import multer from "multer";
import { admin, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();
// set the storage for the file
const storage=multer.diskStorage({
  destination(req,file,cb){
    cb(null,"uploads/");  //null is for the error
  },
  filename(req,file,cb){
    // A generated name, so nothing from the client ends up in the file path
    cb(null,`${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
  },

});

// check the file type of the upload

function fileFilter(req,file,cb){
  // to check the file and file type before uploading
  // if (!file || !file.originalname) {
  //   return cb(new Error('File is missing or invalid'), false);
  // }
  // console.log("file object",file);
  const extname = /^\.(jpe?g|png)$/.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^image\/(jpe?g|png)$/.test(file.mimetype);


  if(extname && mimetype){
    return cb(null,true);
  }else{
    cb(new Error("Image file only!"),false);
  }
}

const upload=multer({
  storage,
  fileFilter,
  limits:{fileSize:5*1024*1024,files:1}, // 5MB
})

const uploadSingleImage=upload.single("image");

// middleware for the single image uploading

router.post("/", protectRoute, admin, (req,res)=>{
  uploadSingleImage(req,res,function(err){
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    }

     res.status(200).send({
      message: 'Image uploaded',
      image: `/${req.file.path}`,
    });
  });
});

// router.post("/",(req,res)=>{
//   res.send("router is working");
// })



export default router;