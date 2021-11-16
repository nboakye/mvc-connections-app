const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();

router.get('/new', controller.new);

// POST to create new user
router.post('/', controller.create);

module.exports = router;