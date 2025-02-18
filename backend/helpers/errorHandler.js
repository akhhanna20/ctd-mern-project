// error handler middleware
const errorHandler = (err, req, res, next) => {
  // check if response headers have already been sent to the client
  if (res.headersSent) {
    // if true, pass the error to the next error-handling middleware
    return next(err);
  }

  // set the status code of the response
  const statusCode =
    res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode); // set the status code of the response
};

//log the error to the console
errorHandler.log = (err, req, res, next) => {
  console.error(err);
  next();
};

export default errorHandler;
