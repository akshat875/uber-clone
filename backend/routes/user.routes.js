const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

// Register route
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);

// Protected routes
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;