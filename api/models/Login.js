var mongoose = require('mongoose');

var LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

LoginSchema.statics.generateCode = function generateCode(len) {
    var maxlen = 8,
        min = Math.pow(16, Math.min(len, maxlen) - 1),
        max = Math.pow(16, Math.min(len, maxlen)) - 1,
        n = Math.floor(Math.random() * (max - min + 1)) + min,
        r = n.toString(16);
    while (r.length < len) {
        r = r + randHex(len - maxlen);
    }
    return r.toUpperCase();
};

module.exports = mongoose.model('Login', LoginSchema);