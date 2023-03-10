const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  description: {
    type: String,
    required: true,
    unique: false,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
