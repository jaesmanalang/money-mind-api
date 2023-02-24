const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const {
  listExpenses,
  createExpense,
} = require('../controller/expenseController');

router.get('/', verifyJWT, listExpenses);
router.post('/', verifyJWT, createExpense);

module.exports = router;
