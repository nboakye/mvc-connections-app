const express = require('express');
const controller = require('../controllers/userController');
const {isGuest} = require('../middlewares/auth');

const router = express.Router();

// GET /users/new: displays form to register
router.get('/new', isGuest, controller.new);

// POST to create new user
router.post('/', isGuest, controller.create);

// GET form for login page
router.get('/login', isGuest, controller.login);

// POST to login
router.post('/login', isGuest, controller.authenticate);

// GET to view profile page
router.get('/profile', controller.profile);

// GET to logout
router.get('/logout', controller.logout);

module.exports = router;