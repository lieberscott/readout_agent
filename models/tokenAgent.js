const mongoose = require('mongoose');

const tokenAgentSchema = mongoose.Schema({
  verification_token: { type: String, required: true },
  createdAt: { type: Date, expires: 2700, default: Date.now }
});

module.exports = mongoose.model('TokenAgent', tokenAgentSchema);
