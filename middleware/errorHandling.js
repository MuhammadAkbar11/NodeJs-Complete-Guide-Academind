const errorHandling = (error, req, res, next) => {
  const { statusCode, message, data } = error;
  return res.status(statusCode || 500).json({
    message: message,
    data: data,
    ...error,
  });
};
module.exports = errorHandling;
