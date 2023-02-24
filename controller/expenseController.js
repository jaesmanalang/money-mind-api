const Expense = require('../models/Expense');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');

const listExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id });
  res.status(200).json({
    expenses,
    user: req.user.id,
  });
});

const createExpense = asyncHandler(async (req, res, next) => {
  const { description, amount } = req.body;

  if (isNaN(amount)) {
    return next(new AppError('Amount must be a number', 400));
  }

  if (amount <= 0) {
    return next(new AppError('Invalid amount', 400));
  }

  const newExpense = new Expense({
    user: req.user.id,
    description,
    amount,
  });

  const savedExpense = await newExpense.save();

  res.status(200).json({
    expense: savedExpense,
  });
});

module.exports = {
  listExpenses,
  createExpense,
};
