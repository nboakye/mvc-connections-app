const model = require('../models/user');
// const User = require('../models/user');
const Connection = require('../models/connection');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    user.save()
    .then(() => res.redirect('./users/login'))
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('./new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email address has been used');
            return res.redirect('./new');
        }
        next(err);
    });
};

exports.login = (req, res) => {
    res.render('./user/login');
};

exports.authenticate = (req, res) => {
    // authenticate
    let email = req.body.email;
    let password = req.body.password;

    // query database with mongoose
    model.findOne({email: email})
    .then(user => {
        if(user) {
            // user found 
            user.comparePassword(password)
            .then(result=> {
                if(result) {
                    // store user id in session
                    req.session.user = user._id;
                    req.session.username = user.firstName;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('./profile');
                } else {
                    req.flash('error', 'Wrong password');
                    res.redirect('./login');
                }
            })
        } else {
            req.flash('error', 'Wrong email address');
            res.redirect('./login');
        }
    })
    .catch(err=>next(err)); 
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({host: id})])
    .then(results => {
        const [user, connections] = results;
        res.render('./user/profile', {user, connections});
    })
    .catch(err=>next(err))
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err)
            return next(err);
        else
            res.redirect('/');
    })
}