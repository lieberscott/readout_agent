const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  agent_id: { type: String, required: true},
  password: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  polls_arr: [{
    admin_id: { type: String },
    poll_id: { type: String },
    orgname: { type: String },
    poll_start: { type: Date },
    num_assigned: { type: Number },
    is_open: { type: Boolean }
  }],
  gms_arr: [{
    admin_id: { type: String },
    gm_id: { type: String },
    orgname: { type: String },
    gm_start: { type: Date },
    num_assigned: { type: Number },
    is_open: { type: Boolean }
  }]
}, { strict: false });

module.exports = mongoose.model('Agent', agentSchema);
