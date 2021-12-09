const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    //message: 'That was too many log in requests. Try again later.'
    handler: (req, res, next) =>{
        let err = new Error('That was too many log in requests. Try again later');
        err.status = 429;
        return next(err);
    }
});