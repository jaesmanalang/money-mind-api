const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  const emailExists = await User.findOne({
    email,
  });

  const usernameExists = await User.findOne({
    username,
  });

  if (usernameExists) {
    return next(new AppError('Username is already taken', 400));
  }

  if (emailExists) {
    return next(new AppError('Email address already exists', 400));
  }

  const user = new User(req.body);

  await user.save();

  const token = generateAccessToken(user.id);

  res.status(201).json({
    message: 'Registration successful!',
    token,
  });
});

module.exports = {
  register,
};
