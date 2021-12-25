const express = require('express');
const router = new express.Router();
const items = require('./fakeDb');
const ExpressError = require('./ExpressError');

router.get('/', (req,res) => {
    res.status(200).json({items: items})
});

router.get('/:name', (req,res,next) => {
    const requestedItem = req.params.name;
    let price;
    for (let item of items) {
        if (item.name == requestedItem) {
            price = item.price;
        }
    };
    try {
        if (!price) {
            throw new ExpressError('Resource not found',404);
        } else {
            return res.status(200).json({name: requestedItem, price: price});
        }
    } catch(e) {
        return next(e);
    };
});

router.post('/', (req,res, next) => {
    try {
        if (!req.body.name) {
            throw new ExpressError('Request requires "name" field',404);
        } else if (!req.body.price) {
            throw new ExpressError('Request requires "price" field',404);
        }
        for (let item of items) {
            if (item.name == req.body.name) {
                throw new ExpressError('Item name already exists',404);
            }
        };
        items.push(req.body);
        res.status(201).json({added: req.body});
    } catch(e) {
        return next(e);
    };
});

router.patch('/:name', (req,res,next) => {
    const requestedItem = req.params.name;
    let response;
    try {
        if (!req.body.name) {
            throw new ExpressError('Request requires "name" field',404);
        } else if (!req.body.price) {
            throw new ExpressError('Request requires "price" field',404);
        }
        for (let item of items) {
            if (item.name == requestedItem) {
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
    const requestedItem = req.params.name;
    let itemIndex;
    for (let i=0; i<items.length; i++) {
        if (items[i].name == requestedItem) {
            itemIndex = i;
        };
    };
    try {
        if (!itemIndex) {
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