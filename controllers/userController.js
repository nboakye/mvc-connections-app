const model = require('../models/user');
const User = require('../models/user');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
    .then(() => res.redirect('./user/login'))
    .catch(err=>next(err));
};