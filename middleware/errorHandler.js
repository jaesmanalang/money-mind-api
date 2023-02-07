const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    const duplicateField = err.message.match(/index: (.*) dup key/)[1];
    return res
      .status(400)
      .json({ error: `The ${duplicateField} already exists` });
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({
    status,
    message,
  });
};

module.exports = errorHandler;
