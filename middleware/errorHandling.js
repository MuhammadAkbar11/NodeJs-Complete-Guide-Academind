const errorHandling = (error, req, res, next) => {
  console.log(error, "this error handling");
  const { statusCode, message } = error;
  console.log(message);
  res.status(statusCode || 500).json({
    message: message,
    ...error,
  });
};
module.exports = errorHandling;
