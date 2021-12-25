const express = require('express');
const items = require('./fakeDb');
const app = require('./app');
const request = require('supertest');


beforeEach(function(){
    items.push({name: 'cheerios', price: '3.40'});
});

afterEach(function(){
    items.length = 1;
});

describe('GET /items', function() {
    test('Get all items', async () => {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items: [
            {name: 'apple', price: '1.00'},
            {name: 'cheerios', price: '3.40'}
        ]});
    });
});

describe('GET /items/:name', function() {
    test('Get a specific item by name', async () => {
        const resp = await request(app).get('/items/cheerios');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({name: 'cheerios', price: '3.40'});
    });
    test('Returns error if item name is not in database', async () => {
        const resp = await request(app).get('/items/marshmallows');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({error: 'Resource not found'});
    })
});

describe('POST /items', function() {
    test('Add a new item', async () => {
        const resp = await request(app).post('/items').send({name: 'popsicle', price: '1.45'});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({"added": {name: 'popsicle', price: '1.45'}});
    });
    test('Reject adding an existing item', async () => {
        const resp = await request(app).post('/items').send({name: 'cheerios', price: '3.40'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": "Item name already exists"});
    });
    test('Reject adding an item without name', async () => {
        const resp = await request(app).post('/items').send({type: 'popsicle', price: '1.45'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Request requires "name" field'});
    });
    test('Reject adding an item without price', async () => {
        const resp = await request(app).post('/items').send({name: 'popsicle', cost: '1.45'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Request requires "price" field'});
    });
});

describe('PATCH /items/:name', function() {
    test('Update an item', async () => {
        const resp = await request(app).patch('/items/cheerios').send({name: 'new popsicle', price: '2.45'});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {name: 'new popsicle', price: '2.45'}});
    });
    test('Reject updating a non-existent item', async () => {
        const resp = await request(app).patch('/items/ragamuffin').send({name: 'new popsicle', price: '2.45'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Resource not found'});
    });
    test('Reject updating an item without a name', async () => {
        const resp = await request(app).patch('/items/cheerios').send({type: 'new popsicle', price: '2.45'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Request requires "name" field'});
    });
    test('Reject updating an item without a price', async () => {
        const resp = await request(app).patch('/items/cheerios').send({name: 'new popsicle', cost: '2.45'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Request requires "price" field'});
    });
});

describe('DELETE /items/:name', function() {
    test('Update an item', async () => {
        const resp = await request(app).delete('/items/cheerios');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message": "Deleted"});
    });
    test('Reject deleting a non-existent item', async () => {
        const resp = await request(app).delete('/items/ragamuffin');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({"error": 'Resource not found'});
    });
})