const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  poll_id: { type: String, required: true, unique: true },
  admin_id: { type: String, required: true },
  orgname: { type: String, required: true}, // "Lauren Underwood for Congress"
  parties_arr: { type: Array, default: undefined },
  phone: { type: Number, required: true },
  candidates: [String],
  agents: { type: Array, default: [] },
  poll_start: { type: Date, default: new Date },
  poll_end: { type: Date, default: undefined },
  finished: { type: Boolean, default: false },
  predictive_scores_ready: { type: Boolean, default: false },
  keys: { type: Array, default: [] },
  election_month: { type: String, required: true },
  election_day: { type: String, required: true },
  office: { type: String, required: true },
  primary: { type: Boolean, required: true },
  population_size: { type: Number, required: true },
  demographic_info: {
    gender: { m: { type: Number }, f: { type: Number } },
    age: { "18-29": { type: Number }, "30-39": { type: Number }, "40-49": { type: Number }, "50-64": { type: Number }, "65+": { type: Number } },
    party: { d: { type: Number }, r: { type: Number }, i: { type: Number } }
  },
  percentagesDeepAllCandidates: { type: Array, default: [] }
}, { strict: false })

module.exports = mongoose.model('Poll', pollSchema);
