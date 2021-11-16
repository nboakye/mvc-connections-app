const model = require('../models/user');
const User = require('../models/user');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
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
    User.findOne({email: email})
    .then(user => {
        if(user) {
            // user found 
            user.comparePassword(password)
            .then(result=> {
                if(result) {
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

exports.profile = (req, res) => {
    res.render('/profile');
}