var mongoose = require('mongoose');

var CodeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  usermail: { type: String, required: true },
  clientId: { type: String, required: true }
});

module.exports = mongoose.model('Code', CodeSchema);