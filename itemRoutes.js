const express = require('express');
const router = new express.Router();
const items = require('./fakeDb');
const ExpressError = require('./ExpressError');
const middleware = require('./middleware');

router.get('/', (req,res) => {
    res.status(200).json({items: items})
});

router.get('/:name', (req,res,next) => {
    const requestedItem = items.filter( (item) => {
        return item.name === req.params.name;
    });
    try {
        if (requestedItem.length == 0) {
            throw new ExpressError('Resource not found',404);
        } else {
            return res.status(200).json(requestedItem[0]);
        }
    } catch(e) {
        return next(e);
    };
});

router.post('/', middleware.checkData, (req,res, next) => {
    try {
        items.forEach( (item) => {
            if (item.name == req.body.name) throw new ExpressError('Item name already exists',404);
        });
        items.push(req.body);
        res.status(201).json({added: req.body});
    } catch(e) {
        return next(e);
    };
});

router.patch('/:name', middleware.checkData, (req,res,next) => {
    let response;
    try {
        for (let item of items) {
            if (item.name == req.params.name) {
                item.name = req.body.name;
                item.price = req.body.price;
                response = item;
            }
        };
        if (!response) {
            throw new ExpressError('Resource not found',404);
        } else {
            return res.status(200).json({updated: response});
        }
    } catch(e) {
        return next(e);
    };
});

router.delete('/:name', (req,res, next) => {
    const itemIndex = items.findIndex( (item) => {
        return item.name === req.params.name;
    });
    try {
        if (itemIndex == -1) {
            throw new ExpressError('Resource not found',404);
        } else {
            items.splice(itemIndex,1);
            return res.status(200).json({message: "Deleted"});
        }
    } catch(e) {
        return next(e);
    };
});

module.exports = router;