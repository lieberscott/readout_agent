const mongoose = require('mongoose');

const emailverificationSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verification_token: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 900, default: Date.now }
});

module.exports = mongoose.model('Emailverification', emailverificationSchema);