const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../utils/generateToken');

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

const login = asyncHandler(async (req, res, next) => {
  // Check if fields are empty
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError('All fields are required', 400));
  }

  // Check if user does not exists
  const foundUser = await User.findOne({ username }).select('+password');
  if (!foundUser) {
    return next(new AppError('User does not exists', 401));
  }

  // Check if password does not match
  const isPasswordMatch = await foundUser.correctPassword(
    password,
    foundUser.password
  );

  if (!isPasswordMatch) {
    return next(new AppError('Incorrect password', 401));
  }

  // Generate access token
  const accessToken = generateAccessToken(foundUser.id);

  // Create secure cookie with accessToken
  res.status(202).cookie('accessToken', accessToken, {
    // domain: '.railway.app',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
    },
  });
});

const refresh = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return next(new AppError('No refresh token', 401));
  }

  const refreshToken = cookies.refreshToken;

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const foundUser = await User.findOne({ _id: decoded });

  if (!foundUser) {
    return next(new AppError('Unauthorized. No user found.'));
  }

  const accessToken = generateAccessToken(foundUser.id);

  res.cookie('accessToken', accessToken, {
    domain: '.railway.app',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
    },
  });
});

const logout = (req, res, next) => {
  res.status(202).clearCookie('accessToken');
  return res.json({ message: "You've been logged out." });
};

module.exports = {
  login,
  register,
  refresh,
  logout,
};
