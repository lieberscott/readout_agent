const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
  admin_id: { type: String, required: true },
  "Voter File VANID": { type: Number, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Zip: { type: Number, required: true },
  "Cell Phone": { type: Number },
  requested_off: { type: Boolean, default: false },
  do_not_share: { type: Boolean, default: false },
  has_cell: { type: Boolean, required: true },
  general_messages: [{
    _id: false,
    gm_id: { type: String, default: null },
    rsvp: { type: Number, default: 0 }, // 0 is have not rsvp'd, 1 is no, 2 is yes
    camp_phone: { type: Number, default: null }, // campaign phone number, not voter phone number
    sent: { type: Boolean, default: false },
    last_sent: { type: Date, default: null },
    agent_id: { type: String, default: -1 },
    date_of_last_message: { type: Number },
    messages: [{
      date: { type: Date },
      content: { type: String },
      sender_id: { type: String },
      read: { type: Boolean }
    }]
  }],
  polls: [{
    _id: false,
    poll_id: { type: String, default: null },
    camp_phone: { type: Number, default: -1 }, // campaign phone number, not voter phone number
    has_responded: { type: Boolean, default: false },
    response_arr: { type: Array, default: [] },
    mixed_res_arr: { type: Array, default: [] },
    response: { type: Number, default: -1 }, // this ALWAYS corresponds to the index of the candidates array from the Poll schema, NOT the mixed_res_array in this schema
    predictive_score: { type: Number, default: -1 },
    texts_sent: { type: Number, default: 0 },
    last_sent: { type: Date, default: null },
    agent_id: { type: String, default: -1 },
    date_of_last_message: { type: Number },
    messages: [{
      date: { type: Date },
      content: { type: String },
      sender_id: { type: String },
      read: { type: Boolean }
    }]
  }],
  party: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Number, required: true }
});

voterSchema.index({ "Voter File VANID": 1, "admin_id": 1 }, { "unique": true });

module.exports = mongoose.model('Voter', voterSchema);
