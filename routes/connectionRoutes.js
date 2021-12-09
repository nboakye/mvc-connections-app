const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth')
const { validateId } = require('../middlewares/validator');
const {body} = require('express-validator');

const router = express.Router();

//GET /connections: display all the connections to the user
router.get('/', controller.index);

//GET /connections/new: display form to create new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connections: create new connection
router.post('/', isLoggedIn, 
[body('title').trim().escape(),
body('category').trim().escape(),
body('details', 'Must be 8 or more characters').isLength({min: 8}).trim().escape(),
body('date', 'Must be a valid date').isDate({format: 'YYYY-MM-DD'}).isAfter().trim().escape(),
body('start').trim().escape(),    
body('end').trim().escape(),
body('image', 'Image is not a URL').isURL().trim(),
body('location', 'Location cannot be empty').not().isEmpty().trim().escape()],
controller.create);

//GET /connections/:id: display connection page
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form to edit the connection
router.get('/:id/edit', isLoggedIn, isHost, validateId, controller.edit);

//PUT /connections/:id: update the connection
router.put('/:id', isLoggedIn, isHost, validateId, 
[body('title').trim().escape(),
body('category').trim().escape(),
body('details', 'Must be 8 or more characters').isLength({min: 8}).trim().escape(),
body('date', 'Must be a valid date').isDate({format: 'YYYY-MM-DD'}).isAfter().trim().escape(),
body('start').trim().escape(),    
body('end').trim().escape(),
body('image', 'Image is not an URL').isURL().trim(),
body('location', 'Location cannot be empty').not().isEmpty().trim().escape()],
controller.update);

//DELETE /connections/:id: delete the connection
router.delete('/:id', isLoggedIn, isHost, validateId, controller.delete);

// POST for creating and updating RSVP
router.post('/:id/rsvp', validateId, isLoggedIn, isNotHost, controller.rsvpEdit);

// DELETE for deleting rsvp
router.delete('/:id/rsvp', validateId, isLoggedIn, controller.rsvpDelete);

module.exports = router;