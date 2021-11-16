// For checking when user is a Guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        // req.flash('error');
        return res.redirect('/users/profile');
    }
}

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        // req.flash('error');
        return res.redirect('/users/login')
    }
}