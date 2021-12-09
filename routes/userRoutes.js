const express = require('express');
const {body} = require('express-validator');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');

const router = express.Router();

// GET /users/new: displays form to register
router.get('/new', isGuest, controller.new);

// POST to create new user
router.post('/', 
[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max:64})],
isGuest, controller.create);

// GET form for login page
router.get('/login', isGuest, controller.login);

// POST to login
router.post('/login', logInLimiter, 
[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max:64})],
isGuest, controller.authenticate);

// GET to view profile page
router.get('/profile', isLoggedIn, controller.profile);

// GET to logout
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;