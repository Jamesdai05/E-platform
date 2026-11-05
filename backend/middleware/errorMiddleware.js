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


const errorHandler = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err);
    }

    // err.status covers errors raised before a route runs, like malformed JSON
    let statusCode=res.statusCode === 200 ? (err.status || 500) : res.statusCode;
    let message = err.message || 'An unexpected error occurred';


    //check for mongoose ObjectId
    if(err.name==="CastError" && err.kind==="ObjectId"){
        message=`Resource Not found:Invalid ObjectId`;
        statusCode=404;
    }


    // Unexpected errors go to the log. Their text can reveal how the app works,
    // so visitors only get a general message in production.
    if(statusCode >= 500){
        console.error(err);
        if(process.env.NODE_ENV === "production"){
            message="Something went wrong. Please try again.";
        }
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,})
}

export {notFound,errorHandler}