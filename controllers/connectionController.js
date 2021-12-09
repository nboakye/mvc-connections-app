const model = require('../models/connection');
const { DateTime } = require("luxon");
const rsvpModel = require('../models/rsvp');
const {validationResult} = require('express-validator');

exports.index = (req, res, next) => {
    model.find()
    .then(connections=> res.render('connection/connections', {connections}))
    .catch(err=> next(err))
};

exports.new = (req, res) => {
    res.render('connection/newConnection');
};

exports.create = (req, res, next) => {
    let connection = new model(req.body);  // create a new document
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    connection.host = req.session.user;
    connection.save()     // insert document to db
    .then(connection => {
        req.flash('success', 'Connection was created!');
        res.redirect('/connections');
    })
    .catch(err=> {
       /* if(err.name === 'ValidationError') {
            err.status = 400;
        } */
        req.flash('error', 'There was an error creating the connection. Please try again');
        res.redirect('back');
    })
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpModel.find({connection:id, status:"YES"})])
    .then(results => {
        const [connection, rsvps] = results;
        if(connection) {
            console.log(connection);
            connection.date = DateTime.fromISO(connection.date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
            connection.start = DateTime.fromISO(connection.start).toLocaleString(DateTime.TIME_SIMPLE);
            connection.end = DateTime.fromISO(connection.end).toLocaleString(DateTime.TIME_SIMPLE);
            res.render('connection/connection', {connection, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    model.findById(id)
    .then(connection => {
        if(connection) {
            return res.render('connection/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        req.flash('error', 'There was an error creating the connection. Please try again');
        redirect('back');
        // next(err);
    })
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {runValidators: true})
    .then(connection => {
        if(connection) {
            res.redirect('/connections/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), rsvpModel.deleteMany({connection:id})])
    .then(connection => {
        if (connection) {
            req.flash('success', 'Successfully deleted the connection')
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
};

exports.rsvpEdit = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    // remove user:req.session.user if not needed
    rsvpModel.findOne({connection:id, user:req.session.user})
    .then(rsvp => {
        if (rsvp) {
            rsvpModel.findByIdAndUpdate(rsvp._id, {status: req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp => {
                req.flash('success', 'Successfully updated your RSVP for this connection!');
                res.redirect('/users/profile');
            })
            .catch(err=> {
                if (err.name === 'ValidationError') {
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        } else {
            let rsvp = new rsvpModel({
                connection: id,
                status: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp => {
                req.flash('success', 'Successfully created an RSVP for this connection!');
                res.redirect('/users/profile');
            })
            .catch(err=> {
                req.flash('error', err.message);
                res.redirect('/');
            });
        }
    })
}

exports.rsvpDelete = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection:id, user:req.session.user})
    .then(rsvp => {
        req.flash('success', 'Successfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=> {
        req.flash('error', err.message);
        next(err);
    });
}