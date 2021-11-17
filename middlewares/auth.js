const Connection = require('../models/connection');

// For checking when user is a Guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login')
    }
};

// check if user is host
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=> {
        if(connection) {
            if(connection.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized access to the resource');
                err.status = 401;
                return next(err);
            }
        }
    })  
    .catch(err=>next(err));
};