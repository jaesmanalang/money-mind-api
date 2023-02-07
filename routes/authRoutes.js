const express = require('express');
const authRoutes = require('../controller/authController');
const router = express.Router();

router.post('/register', authRoutes.register);

module.exports = router;
