const mongoose = require('mongoose');

const custSchema = mongoose.Schema({
                    companyName: {type: String, required: true},
                    custName: {type: String, required: true},
                    address: {type: String, required: true},
                    city: {type: String, required: true},
                    district: {type: String, required: true},
                    state: {type: String, required: true},
                    pin: {type: Number},
                    mobile: {type: Number, required: true},
                    phone: {type: Number},
                    email: {type: String},
                    gstin: {type: String}
                });

module.exports = mongoose.model('Customer', custSchema);