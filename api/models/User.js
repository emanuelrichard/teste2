var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    temp_pswd: {
        type: String
    },
    password: {
        type: String
    },
    os: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    const user = this;

    // Break out if the password hasn't changed or is temporary
    if (!user.isModified('password'))
        return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt((err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return callback(err);
            
            user.password = hash;
            user.temp_pswd = undefined
            callback();
        });
    });
});

// Declares a function to Schema
UserSchema.methods.checkPassword = function comparePassword(password, callback) {
    let pswd = "ç-01"   // Random invalid password (less tha 6 chars)
    if(this.password) pswd = this.password
    bcrypt.compare(password, pswd, callback);
};

module.exports = mongoose.model('User', UserSchema);