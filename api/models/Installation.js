var mongoose = require('mongoose');

var InstallationSchema = new mongoose.Schema({
    installer_id: {
        type: String,
        required: true
    },
    installer_name: {
        type: String,
        required: true
    },
    tub_serial: {
        type: String,
        unique: true,
        required: true
    },
    tub_id: {
        type: String,
        required: true
    },
    tubowner_name: {
        type: String,
        required: true
    },
    tubowner_phone: {
        type: String,
        required: true
    },
    tubowner_addr: {
        type: String,
        required: true
    },
    tubowner_lat: {
        type: String
    },
    tubowner_lng: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Installation', InstallationSchema);