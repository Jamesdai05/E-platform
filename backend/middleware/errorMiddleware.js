const notFound = (req, res, next) => {
    try {
        if (res.headersSent) {
            return next();
        }
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404).json({ error: error.message });
    } catch (err) {
        next(err);
    }
};


const errorHandler=(err,req,res,next)=>{
  let statusCode=res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected error occurred';


  //check for mongoose ObjectId
  if(err.name=="CastError" && err.kind==="ObjectId"){
    message=`Resource Not found:Invalid ObjectId`;
    statusCode=404;
  }

  if(res.headersSent){
    return next()
  }


  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,})
}}

export {notFound,errorHandler}