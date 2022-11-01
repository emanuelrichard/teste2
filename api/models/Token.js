var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  refresh: { type: String, required: true },
  usermail: { type: String, required: true },
  clientId: { type: String, required: true },
  date: {type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);