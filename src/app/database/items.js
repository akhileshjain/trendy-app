const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    itemName: {type: String, required: true}
    // color: {type: String, required: true},
    // size: {type: Number, required: true}
});

module.exports = mongoose.model('Items', itemSchema);