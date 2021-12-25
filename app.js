const express = require('express');
const ExpressError = require('./expressError');
const morgan = require('morgan');
const itemRoutes = require('./itemRoutes');

/* Initiate app instance */
const app = express();

/* Pre-route Middleware */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

/* Add routes */
app.use('/items', itemRoutes);

/* Catch all for route not found */
app.use( (req,res,next) => {
    const e = new ExpressError("Page Not Found", 404);
    next(e);
});

app.use( (error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;
    return res.status(status).json({error: message});
});

module.exports = app;