const model = require('../models/user');
// const User = require('../models/user');
const Connection = require('../models/connection');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    user.save()
    .then(() => res.redirect('./login'))
    .catch(err=>next(err));
};

exports.login = (req, res) => {
    res.render('./user/login');
};

exports.authenticate = (req, res) => {
    // authenticae
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
                    res.redirect('./profile');
                } else {
                    console.log('wrong password');
                    res.redirect('./login');
                }
            })
        } else {
            console.log('wrong email address');
            res.redirect('./login');
        }
    })
    .catch(err=>next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({author: id})])
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