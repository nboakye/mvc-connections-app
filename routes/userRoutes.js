const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();

router.get('/new', controller.new);

// POST to create new user
router.post('/', controller.create);

// GET login page
router.get('/login', controller.login);

// POST to login
router.post('/login', controller.authenticate);

module.exports = router;