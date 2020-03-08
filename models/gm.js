const mongoose = require('mongoose');

const gmSchema = mongoose.Schema({
  gm_id: { type: String, required: true, unique: true },
  gm_title: { type: String, required: true, default: "Your messaging Campaign " + Date.now.toString() },
  orgname: { type: String, required: true },
  areacode: { type: Number, required: true },
  rsvps_boolean: { type: Boolean, required: true },
  rsvps: { type: Number, default: 0 },
  gm_start: { type: Date, default: new Date },
  closed: { type: Boolean, default: false },
  admin_id: { type: String, required: true },
  phone: { type: Number, default: -1 },
  agents: { type: Array, default: [] },
  population_size: { type: Number, default: 0 },
  text: { type: String, required: true }
}, { strict: false })

module.exports = mongoose.model('Gm', gmSchema);
