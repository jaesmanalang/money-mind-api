const express = require('express');
const authRoutes = require('../controller/authController');
const router = express.Router();

router.post('/login', authRoutes.login);
router.post('/register', authRoutes.register);
router.get('/logout', authRoutes.logout);

module.exports = router;
