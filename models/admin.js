const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean, default: true },
  admin_id: { type: String, required: true },
  candidatefirst: { type: String, required: true },
  candidatelast: { type: String, required: true },
  userfirst: { type: String, required: true },
  userlast: { type: String, required: true },
  office: { type: String, required: true },
  party: { type: String, required: true },
  state: { type: String, required: true },
  orgname: { type: String, required: true },
  has_file: { type: Boolean, default: false },
  date_created: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  population_size: { type: Number, default: -1 }, // based on size of voter file, used to determine cost
  polls: [String]
}, { strict: false });

module.exports = mongoose.model('Admin', adminSchema);
