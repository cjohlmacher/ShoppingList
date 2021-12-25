const ExpressError = require('./ExpressError');

const checkData = (req,res,next) => {
    try {
        if (!req.body.name) {
            throw new ExpressError('Request requires "name" field',404);
        } else if (!req.body.price) {
            throw new ExpressError('Request requires "price" field',404);
        };
        return next();
    } catch(e) {
        return next(e);
    }
};

module.exports = { checkData };