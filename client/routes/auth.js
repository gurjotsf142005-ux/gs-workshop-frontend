// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { adminAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', adminAuth, getMe);

module.exports = router;
