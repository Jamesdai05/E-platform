import path from "path";
import express from 'express';

import multer from "multer";

const router = express.Router();
// set the storage for the file
const storage=multer.diskStorage({
  destination(req,file,cb){
    cb(null,"uploads/");  //null is for the error
  },
  filename(req,file,cb){
    // cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    cb(null,`${Date.now()}-${file.originalname}`)
  },

});

// check the file type of the upload

function fileFilter(file,cb){
  // to check the file and file type before uploading
  // if (!file || !file.originalname) {
  //   return cb(new Error('File is missing or invalid'), false);
  // }
  const  filetypes = /jpe?g|png/;
  // console.log("file object",file);
  console.log(file.originalname)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);


  if(extname && mimetype){
    return cb(null,true);
  }else{
    cb(new Error("Image file only!"),false);
  }
}

const upload=multer({
  storage,fileFilter
})

const uploadSingleImage=upload.single("image");

// middleware for the single image uploading

router.post("/", (req,res)=>{
  uploadSingleImage(req,res,function(err){
    if (err) {
      return res.status(400).send({ message: err.message });
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