const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', auth, (req, res) => {
    res.json(req.user);
});

module.exports = router;
