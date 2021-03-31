const errorHandling = (error, req, res, next) => {
  console.log(error, "this error handling");
  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json({
    message: message,
    data: data,
    ...error,
  });
};
module.exports = errorHandling;
