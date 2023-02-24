const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError('Access denied, no token provided.', 401));
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const foundUser = await User.findOne({ _id: decoded.id });

  if (!foundUser) {
    return next(new AppError('User not found', 401));
  }

  req.user = foundUser;
  next();
});

module.exports = verifyJWT;
