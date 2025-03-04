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
  try{
    if(res.headersSent){
      return next(err)
    }

    let statusCode=res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'An unexpected error occurred';

    // console.log(err)
    // if (err.name === "CastError" && err.typeValue === "ObjectId") {
    //   message = `Resource Not found:Invalid ObjectId`;
    //   statusCode = 404;
    // }

    res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,})

  }catch(newErr){
    console.log(newErr);
    next(newErr)
  }

}

export {notFound,errorHandler}