import jwt from "jsonwebtoken";

const generateToken=(res,useId)=>{
  const token=jwt.sign({useId},process.env.JWT_SECRET,{
        expiresIn:"10d",
  });

  // set JWT as http-only cookie
  res.cookie("jwt",token,{
    httpOnly:true,
    // secure:process.env.NODE_ENV !=="development",
    secure:false,
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 *1000 //10days in milliseconds
  }).status(200)
}

export default generateToken