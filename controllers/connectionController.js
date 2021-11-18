const model = require('../models/connection');
const { DateTime } = require("luxon");

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
    connection.host = req.session.user;
    connection.save()     // insert document to db
    .then(connection => res.redirect('/connections'))
    .catch(err=> {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    })
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error(id + ' is not a valid connection id');
        err.status = 400;
        return next(err);
    }
    model.findById(id).populate('host', 'firstName lastName')
    .then(connection => {
        if(connection) {
            console.log(connection);
            connection.date = DateTime.fromISO(connection.date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
            connection.start = DateTime.fromISO(connection.start).toLocaleString(DateTime.TIME_SIMPLE);
            connection.end = DateTime.fromISO(connection.end).toLocaleString(DateTime.TIME_SIMPLE);
            res.render('connection/connection', {connection});
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
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error(id + ' is not a valid connection id');
        err.status = 400;
        return next(err);
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
    .catch(err=>next(err))
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error(id + ' is not a valid connection id');
        err.status = 400;
        return next(err);
    }

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

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error(id + ' is not a valid connection id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id)
    .then(connection => {
        if (connection) {
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
};