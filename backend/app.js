const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Item = require('../src/app/database/items');
const Customer = require('../src/app/database/customer');

mongoose.connect('mongodb+srv://dbadm:hssqHgYajGmRg553@cluster0.evbjt.mongodb.net/trendy?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to database!');
}).catch((err) => {
    console.log(err);
    console.log('Something went wrong!');
});

app.use(bodyParser.json());
app.set('view engine', 'html');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});
app.use('/api/bills', (req, res, next) => {
    let data = [{'id': 'sefwefw3133', 'name': 'akhil', 'age': 28},
                {'id': 'sefwefw3133', 'name': 'nikhil', 'age': 25}]
    res.status(200).json({
       "message": "Tada",
        "data": data
    });    
});
app.get('/api/items', (req, res, next) => {
    Item.find().then((documents) => {
        res.status(200).json({
            "message": "Items fetched successfully!",
             "data": documents
         });    
    }).catch(() => {

    });
});
app.post('/api/customer', (req, res, next) => {
    const customer = new Customer({
        companyName: req.body.companyName,
        custName: req.body.custName,
        address: req.body.address,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        pin: req.body.pin,
        mobile: req.body.mobile,
        phone: req.body.phone,
        email: req.body.email,
        gstin: req.body.gstin
    });
    customer.save();
    res.status(201).json({
        'message': 'Customer Added Successfully!'
    });
});

app.post('/api/item', (req, res, next) => {
    const item = new Item({
        itemName: req.body.itemName
        // color: req.body.color,
        // size: req.body.size
    });
    item.save();
    res.status(201).json({
        'message': 'Item added Successfully!'
    });
});

module.exports = app;