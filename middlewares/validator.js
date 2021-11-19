exports.validateId = (req, res, next) => {
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error(req.params.id + ' is not a valid connection id');
        err.status = 400;
        return next(err);
    }
}