var mongoose = require('mongoose');
var HashF30 = require('../utils/HashF30')

var ClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  secret: { type: String, required: true },
  usermail: { type: String, required: true }
});

// Decrypt the password to send in response
ClientSchema.statics.decryptSecretOf = function(data) {
  return data.map(function(client) {
      return {
        name: client.name,
        id: client.id,
        secretF30: client.secret,
        secret: HashF30.decrypt(client.secret),
        usermail: client.usermail
      }
  })
}

// Execute before each client.save() call
ClientSchema.pre('save', function(callback) {
  const client = this;

  // Break out if the password hasn't changed
  if (!client.isModified('secret')) return callback();

  // Password changed so we need to hash it
  let hash = HashF30.encrypt(client.secret)
  client.secret = hash
  callback()
});

// Declares a function to Schema
ClientSchema.methods.checkPassword = function comparePassword(password, callback) {
  
};

module.exports = mongoose.model('Client', ClientSchema);