const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost} = require('../middlewares/auth')
const { validateId } = require('../middlewares/validator');

const router = express.Router();

//GET /connections: display all the connections to the user
router.get('/', controller.index);

//GET /connections/new: display form to create new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connections: create new connection
router.post('/', isLoggedIn, controller.create);

//GET /connections/:id: display connection page
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form to edit the connection
router.get('/:id/edit', isLoggedIn, isHost, validateId, controller.edit);

//PUT /connections/:id: update the connection
router.put('/:id', isLoggedIn, isHost, validateId, controller.update);

//DELETE /connections/:id: delete the connection
router.delete('/:id', isLoggedIn, isHost, validateId, controller.delete);

module.exports = router;