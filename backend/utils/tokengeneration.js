import jwt from "jsonwebtoken";

const generateToken=(res,userId)=>{
  const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"10d",
  });

  // set JWT as http-only cookie
  res.cookie("jwt",token,{
    httpOnly:true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
    maxAge: 10 * 24 * 60 * 60 *1000 //10days in milliseconds
  }).status(200)
}

export default generateToken