const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator');
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const multer = require("multer");
const nodemailer = require("nodemailer");
const ObjectId = require('mongoose').Types.ObjectId;
const path = require("path");
const randomstring = require("randomstring");
const shortid = require("shortid");
require ("dotenv").config();

const database = process.env.DATABASE;
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);

const Emailverification = require('./models/emailverification.js');
const PasswordresetAgent = require('./models/passwordresetAgent.js');

const Admin = require('./models/admin.js');
const Agent = require('./models/agent.js');
const Gm = require('./models/gm.js');
const Poll = require('./models/poll.js');
const TokenAgent = require('./models/tokenAgent.js');
const Voter = require('./models/voter.js');

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 6000000 }, // fileSize limit is set at 6MB
  fileFilter: (req, file, cb) => { path.extname(file.originalname) == ".csv" ? cb(null, true) : cb("Must be a .csv file") }
}).single("file");

const transport = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const verifyTokenAgent = (req, res, next) => {
  const token = req.body.token;
  jwt.verify(token, process.env.JWT_KEY, (err, authData) => {
    if(err) {
      console.log("err : ", err);
      res.sendStatus(403);
    } else {
      req.authData = {};
      TokenAgent.findOne({ verification_token: token }).exec()
      .then((result) => {
        if (result) {
          req.authData.id = authData.id;
          next();
        }
        else {
          return res.sendStatus(403);
        }
      })
      .catch((err) => {
        console.log("error : ", err);
        return res.sendStatus(403);
      })
    }
  });
};

const verifyTwilio = (req, res, next) => {
  if (req.body.accountSid != process.env.SID) {
    console.log("err : ", err);
    res.sendStatus(403);
  } else {
    next();
  }
};


let filename;


let recursiveFunc = (percentagesDeepObj) => { // arr is `criteriaArr`
  let total = 0;
  let subkeysArr = Object.getOwnPropertyNames(percentagesDeepObj); // ["white", "black", "hispanic", "asian", "other"] or ["male", "female"], or ["17-29", "30-44", "45-64", "65+"], etc.
  let subkey;
  if (Object.getOwnPropertyNames(percentagesDeepObj[subkeysArr[0]]).length == 0) {
    // have reached lowest level, because arr.length will also be the number of levels down percentagesDeepObj goes
    // use of "i" here is correct. "i" interacts predominantly with the arr of categories/subkeys
    for (let j = 0; j < subkeysArr.length; j++) {
      subkey = subkeysArr[j]; // "white", then "black", etc.
      total += percentagesDeepObj[subkey];
    }
    return total;
  }

  // else: have another level down to go
  for (let k = 0; k < subkeysArr.length; k++) {
    subkey = subkeysArr[k]; // "male", then "female"
    let obj = percentagesDeepObj[subkey]; // subobject of the object (another level down)
    let amt = recursiveFunc(obj);
    total += amt;
  }
  return total; // this is the candidate's total percentage of the vote
}


module.exports = (app, database) => {

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
  const db = mongoose.connection;

  app.post("/protected", verifyTokenAgent, (req, res) => {
    console.log("protected return");
    return res.json({ success: "success" });
  });

  app.post("/sendmessage", verifyTokenAgent, (req, res) => {

    let mixed_res_arr = req.body.mixed_res_arr;
    let text = req.body.text;
    let voter_id = req.body.voter_id;
    let poll_id = req.body.poll_id;
    let admin_id;

    // these two lines check if number has a +1 in front, and strips it away if so, so that whether it's there to start with or not, we strip it away and then add it in
    let t = req.body.text_to;
    let text_to;
    if (t) {
      let text_to0 = t.toString().split(/^\+?1/);
      text_to = text_to0[text_to0.length - 1];
    }

    // then add it back
    text_to = "+1" + text_to;
    let from;

    let d = Date.now();
    let new_msg = {
      date: d,
      content: text,
      sender_id: "readout",
      read: true // only received messages should be considered an unread message
    };

    Poll.findOne({ poll_id }).lean().exec()
    .then(async (poll) => {
      from = poll.phone;
      admin_id = poll.admin_id;
      let admin0 = await Admin.findOne({ admin_id }).lean().exec();
      texts = admin0.texts;
      if (texts > 0) {
        return client.messages.create({ body: text, to: text_to, from });
      }
      else {
        throw new Error("You are out of text messages. Inform your administrator so they can purchase more.");
        return res.json({ error: "Your text was not sent. You are out of text messages. Inform your administrator so they can purchase more."});
      }
    })
    .then((text, err) => {

      if (err) {
        console.log(err);
        throw new Error("Could not send message. Please try again.");
        return res.json({ error: "Could not send message. Please try again."});
      }
      else {
        console.log("text : ", text);
        let update = { "polls.$.mixed_res_arr": mixed_res_arr, "$push": { "polls.$.messages": new_msg }, "polls.$.date_of_last_message": d };
        return Voter.findOneAndUpdate({ "Voter File VANID": voter_id, "polls.poll_id": poll_id }, update).exec();
      }
    })
    .then((voter_res) => {
      return Admin.findOneAndUpdate({ admin_id }, { $inc: { texts: -1 } });
    })
    .then(() => {
      return res.json({ success: "success", texts });
    })
    .catch((err2) => {
      console.log("err2 : ", err2);
      return res.json({ error: "Message could not be sent, please try again." })
    })
  });

  app.post("/sendmessagegm", verifyTokenAgent, (req, res) => {

    let text = req.body.text;
    let voter_id = req.body.voter_id;
    let gm_id = req.body.gm_id;
    let admin_id;

    // these two lines check if number has a +1 in front, and strips it away if so, so that whether it's there to start with or not, we strip it away and then add it in
    let t = req.body.text_to;
    let text_to;
    if (t) {
      let text_to0 = t.toString().split(/^\+?1/);
      text_to = text_to0[text_to0.length - 1];
    }

    // then add it back
    text_to = "+1" + text_to;
    let from;

    let d = Date.now();
    let new_msg = {
      date: d,
      content: text,
      sender_id: "readout",
      read: true // only received messages should be considered an unread message
    };

    Gm.findOne({ gm_id }).lean().exec()
    .then(async (gm) => {
      from = gm.phone;
      admin_id = gm.admin_id;
      let admin0 = await Admin.findOne({ admin_id }).lean().exec();
      texts = admin0.texts;
      if (texts > 0) {
        return client.messages.create({ body: text, to: text_to, from });
      }
      else {
        throw new Error("You are out of text messages. Inform your administrator so they can purchase more.");
        return res.json({ error: "Your text was not sent. You are out of text messages. Inform your administrator so they can purchase more."});
      }
    })
    .then((text, err) => {

      if (err) {
        console.log(err);
        throw new Error("Could not send message. Please try again.");
        return res.json({ error: "Could not send message. Please try again."});
      }
      else {
        console.log("text : ", text);
        let update = { $push: { "gms.$.messages": new_msg }, "gms.$.date_of_last_message": d };
        return Voter.findOneAndUpdate({ "Voter File VANID": voter_id, "general_messages.gm_id": gm_id }, update).exec();
      }
    })
    .then((voter_res) => {
      return Admin.findOneAndUpdate({ admin_id }, { $inc: { texts: -1 } });
    })
    .then(() => {
      return res.json({ success: "success", texts });
    })
    .catch((err2) => {
      console.log("err2 : ", err2);
      return res.json({ error: err2 })
    });
  });

  app.post("/initiatemessage", verifyTokenAgent, (req, res) => {
    console.log("initiate message");

    let poll_id = req.body.poll_id;
    let voter_id = req.body.voter_id;
    let id = req.authData.id;

    let name;
    let month = "";
    let day = "";
    let office = "";
    let primary; // Boolean
    let candidates = [];
    let votername;
    let orgname;

    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      name = agent.name;
      return Voter.findOne({ "Voter File VANID": voter_id, "polls.poll_id": poll_id }).lean().exec()
    })
    .then((voter) => {
      votername = voter.FirstName;
      return Poll.findOne({ poll_id }).lean().exec();
    })
    .then((poll) => {
      console.log("poll : ", poll);
      month = poll.election_month;
      day = poll.election_day;
      office = poll.office;
      primary = poll.primary;
      candidates = poll.candidates;
      orgname = poll.orgname;
      return res.json({ votername, name, month, day, office, primary, candidates, orgname });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: "Unable to initiate message. Please try again." })
    });
  });

  app.post("/initiatemessagegm", verifyTokenAgent, (req, res) => {
    console.log("initiate message");

    let gm_id = req.body.gm_id;
    let voter_id = req.body.voter_id;
    let id = req.authData.id;

    let name;
    let votername;

    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      name = agent.name;
      return Voter.findOne({ "Voter File VANID": voter_id, "general_messages.gm_id": gm_id }).lean().exec();
    })
    .then((voter) => {
      votername = voter.FirstName;
      return Gm.findOne({ gm_id }).lean().exec();
    })
    .then((gm) => {
      console.log("gm : ", gm);
      const orgname = gm.orgname;
      const text = gm.text;

      return res.json({ votername, name, orgname, text });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: "Unable to initiate message. Please try again." })
    });
  });


  app.post("/predictiveresults", verifyTokenAgent, (req, res) => {
    let poll_id = req.body.poll_id;

    Voter.find({ "polls.poll_id": poll_id }).limit(10).exec()
    .then((voters_res) => {
      return res.json({ voters_arr: voters_res });
    })
    .catch((err) => {
      console.log("Err : ", err);
      return res.json({ error: "error" });
    });
  });

  app.post("/responsescreatefile", verifyTokenAgent, (req, res) => {
    let poll_id = req.body.poll_id;
    let candidates;
    let str = "Voter File VANID, FirstName, LastName,";
    let len;
    Poll.findOne({ poll_id }).exec()
    .then((poll_res) => {
      candidates = poll_res.candidates;
      len = candidates.length;
      str += candidates.join();
      str += "\n"
      return Voter.find({ "$and": [{ "polls.poll_id": poll_id, "polls.has_responded": true }] }).exec();
    })
    .then((voters_res) => {
      for (const voter of voters_res) {
        str += voter["Voter File VANID"];
        str += ",";
        str += voter.FirstName;
        str += ",";
        str += voter.LastName;
        str += ",";
        let resp = voter.polls[0].response;
        for (let i = 0; i < len; i++) {
          if (resp == i) {
            str += "1";
          }
          else {
            str += "0";
          }
          if (i < len - 1) {
            str += ",";
          }
        }
        str += "\n";
      }
      let ext = Date.now();
      let f = "public/uploads/responses-" + ext + ".csv";
      fs.writeFile(f, str, 'utf8', (err) => {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
          console.log("err : ", err);
          return res.json({ error: "error" });
        } else {
          return res.json({ ext: ext });
        }
      })
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json("error : ", err);
    })
  });

  app.get("/responsesdownload/:ext", (req, res) => {
    let ext = req.params.ext;
    console.log("Ext : ", ext);
    let f = "public/uploads/responses-" + ext + ".csv";
    res.download(f, "responses.csv", (err) => {
      if (err) {
        console.log("err");
      }
      const directory = 'public/uploads';
      fs.readdir(directory, (err, files) => {
        console.log("files : ", files);
        if (err) {
          console.log(err);
        }

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err2) => {
            if (err2) {
              console.log("err2 : ", err2);
            }
          });
        }
      });
    });
  });

  app.post("/predictiveresultscreatefile", verifyTokenAgent, (req, res) => {
    let poll_id = req.body.poll_id;
    let str = "Voter File VANID, FirstName, LastName,Score\n";
    Voter.find({ "polls.poll_id": poll_id }).exec()
    .then((voters_res) => {
      for (const voter of voters_res) {
        str += voter["Voter File VANID"];
        str += ",";
        str += voter.FirstName;
        str += ",";
        str += voter.LastName;
        str += ",";
        let score = voter.polls[0].predictive_score;
        str += score;
        str += "\n";
      }
      let ext = Date.now();
      let f = "public/uploads/scores-" + ext + ".csv";
      fs.writeFile(f, str, 'utf8', (err) => {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
          console.log("err : ", err);
          return res.json({ error: "error" });
        } else {
          return res.json({ ext: ext });
        }
      })
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json("error : ", err);
    })
  });

  app.get("/predictiveresultsdownload/:ext", (req, res) => {
    let ext = req.params.ext;
    console.log("Ext : ", ext);
    let f = "public/uploads/scores-" + ext + ".csv";
    res.download(f, "scores.csv", (err) => {
      if (err) {
        console.log("err");
      }
      const directory = 'public/uploads';
      fs.readdir(directory, (err, files) => {
        console.log("files : ", files);
        if (err) {
          console.log(err);
        }

        for (const file of files) {
          fs.unlink(path.join(directory, file), (err2) => {
            if (err2) {
              console.log("err2 : ", err2);
            }
          });
        }
      });
    });
  });

  app.post("/getvoters", verifyTokenAgent, (req, res) => {
    const id = req.authData.id;
    const start = req.body.start;
    const poll_id = req.body.poll_id;

    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      let agent_id = agent.agent_id;
      return Voter.find({ polls: { $elemMatch: { agent_id, poll_id } }, requested_off: false }).sort({ "polls.$.date_of_last_message": -1}).skip(start).limit(100);
    })
    .then((response) => {
      return res.json({ voters: response });
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "Unable to get voters. Please try again." })
    })
  });

  app.post("/getvotersgm", verifyTokenAgent, (req, res) => {
    const id = req.authData.id;
    const start = req.body.start;
    const gm_id = req.body.gm_id;

    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      let agent_id = agent.agent_id;
      return Voter.find({ general_messages: { $elemMatch: { agent_id, gm_id } }, requested_off: false }).sort({ "general_messages.$.date_of_last_message": -1 }).skip(start).limit(100)
    })
    .then((response) => {
      return res.json({ voters: response });
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "Unable to get voters. Please try again." });
    })
  });

  app.post("/getvotersinitiate", verifyTokenAgent, (req, res) => {
    const id = req.authData.id;
    const poll_id = req.body.poll_id;
    let initial_message;
    let agent_id;

    // get voters that match both poll_id and an empty messages array, and who haven't requested_off (maybe on a previous poll)
    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      agent_id = agent.agent_id;
      return Poll.findOne({ poll_id }).lean().exec();
    })
    .then((poll_res) => {
      initial_message = poll_res.initial_message;
      const v_query = { polls: { $elemMatch: { poll_id, agent_id, messages: [] } }, requested_off: false };
      return Voter.find(v_query).limit(1000);
    })
    .then((response) => {
      return res.json({ voters: response, initial_message });
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "Unable to get voters. Please try again." })
    });
  });

  app.post("/getvotersinitiategm", verifyTokenAgent, (req, res) => {
    const id = req.authData.id;
    const gm_id = req.body.gm_id;
    let initial_message;
    let agent_id;

    // get voters that match both gm_id and an empty messages array, and who haven't requested_off (maybe on a previous poll)
    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      agent_id = agent.agent_id;
      return Gm.findOne({ gm_id }).lean().exec();
    })
    .then((gm) => {
      textmessage = gm.textmessage;
      const v_query = { general_messages: { $elemMatch: { gm_id, agent_id, messages: [] } }, requested_off: false };
      return Voter.find(v_query).limit(1000);
    })
    .then((response) => {
      return res.json({ voters: response, initial_message });
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "Unable to get voters. Please try again." })
    });
  });

  app.post("/getconvo", verifyTokenAgent, (req, res) => {
    let id = req.authData.id;
    let voter_id = req.body.voter_id;
    let poll_id = req.body.poll_id;
    let projection = { polls: 1, FirstName: 1, LastName: 1, "Cell Phone": 1 };
    let v;

    Voter.findOne({ "Voter File VANID": voter_id }, projection).exec()
    .then((voter) => {
      v = voter.toObject();
      let poll = voter.polls.find((el, i) => el.poll_id == poll_id);
      let index = voter.polls.findIndex(el => el.poll_id == poll_id);
      messages = poll.messages;
      voter.polls[index].messages.forEach((item) => item.read = true);
      console.log("voter.polls : ", voter.polls);
      return voter.save();
    })
    .then((save_res) => {
      return res.json({ voter: v });
    })
    .catch((err) => {
      console.log("Err : ", err);
      return res.json({ error: "Could not get messages. Please try again." })
    });
  });

  app.post("/getconvogm", verifyTokenAgent, (req, res) => {
    const id = req.authData.id;
    const voter_id = req.body.voter_id;
    const gm_id = req.body.gm_id;
    const projection = { general_messages: 1, FirstName: 1, LastName: 1, "Cell Phone": 1 };
    let v;
    let rsvps_boolean;

    Gm.findOne({ gm_id }).lean().exec()
    .then((gm) => {
      rsvps_boolean = gm.rsvps_boolean;
      return Voter.findOne({ "Voter File VANID": voter_id }, projection).exec();
    })
    .then((voter) => {
      v = voter.toObject();
      console.log("voter : ", voter);
      let gm = voter.general_messages.find((el, i) => el.gm_id == gm_id);
      let index = voter.general_messages.findIndex(el => el.gm_id == gm_id);
      messages = gm.messages;
      voter.general_messages[index].messages.forEach((item) => item.read = true);
      console.log("voter.gms : ", voter.general_messages);
      return voter.save();
    })
    .then((save_res) => {
      return res.json({ voter: v, rsvps_boolean });
    })
    .catch((err) => {
      console.log("Err : ", err);
      return res.json({ error: "Could not get messages. Please try again." })
    });
  });

  app.post("/rsvpyes", verifyTokenAgent, (req, res) => {
    const gm_id = req.body.gm_id;
    const voter_id = req.body.voter_id;
    const v_query = { "Voter File VANID": voter_id, { general_messages : { $elemMatch: { gm_id } } } };
    const v_update = { "general_messages.$.rsvp": 2 }

    Voter.findOneAndUpdate(v_query, v_update).lean().exec()
    .then((voter) => {
      return Gm.findOneAndUpdate({ gm_id }, { rsvps: { $inc: 1 } }).lean().exec();
    })
    .then(() => {
      return res.json({ success: "Voter successfully RSVP'd" });
    })
    .catch((err) => {
      console.log("Err : ", err);
      return res.json({ error: "Unable to RSVP voter. Please try again."});
    });
  });

  app.post("/rsvpno", verifyTokenAgent, (req, res) => {
    const gm_id = req.body.gm_id;
    const voter_id = req.body.voter_id;
    const v_query = { "Voter File VANID": voter_id, { general_messages : { $elemMatch: { gm_id } } } };
    const v_update = { "general_messages.$.rsvp": 1 }

    Voter.findOneAndUpdate(v_query, v_update).lean().exec()
    .then((voter) => {
      return res.json({ success: "Voter successfully RSVP'd" });
    })
    .catch((err) => {
      console.log("Err : ", err);
      return res.json({ error: "Unable to RSVP voter. Please try again." });
    });
  });

  app.post("/checkuploaded", verifyTokenAgent, (req, res) => {
    let id = req.authData.id;

    Admin.findOne({ _id: id })
    .exec()
    .then((response) => {
      let admin = response.toObject();
      let has_file = admin.has_file;
      let candidatefirst = admin.candidatefirst;
      let candidatelast = admin.candidatelast;
      let orgname = admin.orgname;
      let party = admin.party;
      return res.json({ candidatefirst, candidatelast, has_file, orgname, party });
    });
  });

  app.post("/account", verifyTokenAgent, (req, res) => {
    let id = req.authData.id;
    Admin.findOne({ _id: id }).lean().exec()
    .then((admin) => {
      let candidatefirst = admin.candidatefirst;
      let candidatelast = admin.candidatelast;
      let email = admin.email;
      let orgname = admin.orgname;
      let paid = admin.paid;
      let office = admin.office;
      return res.json({ candidatefirst, candidatelast, email, orgname, paid })
    })
    .catch((error) => {
      console.log("error : ", error);
      return res.json({ error });
    });
  });

  app.post("/dashboard", verifyTokenAgent, (req, res) => {
    let id = req.authData.id;
    Admin.findOne({ _id: id })
    .exec()
    .then((response) => {
      let admin = response.toObject();
      let polls = admin.polls;
      let userfirst = admin.userfirst;
      let userlast = admin.userlast;
      return res.json({ polls, userfirst, userlast });
    })
    .catch((error) => {
      console.log("error : ", error);
      return res.json({ error });
    });
  });

  app.get("/add2voters", (req, res) => {

    let admin_id = "DgtM4naN";

    let arr = [{
      "Voter File VANID": "111111",
      LastName: "Lieber",
      FirstName: "Scott",
      Zip: 60660,
      "Cell Phone": 8478992558,
      dob: new Date(1984, 4, 25),
      admin_id,
      has_responded: false,
      has_cell: true,
      polls: [],
      party: "d",
      gender: "m"
    },
    {
      "Voter File VANID": "111112",
      LastName: "Lieber",
      FirstName: "Ryan",
      Zip: 60660,
      "Cell Phone": 7086225984,
      dob: new Date(1975, 10, 31),
      admin_id,
      has_responded: false,
      has_cell: true,
      polls: [],
      party: "r",
      gender: "m"
    }];

    Voter.insertMany(arr, { ordered: true})
    .then((response) => {
      console.log("response : ", response);
      return Admin.findOneAndUpdate({ admin_id }, { has_file: true }).exec();
    })
    .then(() => {
      return res.json({ success: "success" });
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "error" });
    });
  });

  app.get("/addsuperadmin", (req, res) => {

    let password = process.env.PASSWORD;

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        console.log("bcrypt error : ", error);
        return res.json({ errors: "Registration failed." });
      }

      Superadmin.create({
        email: "readoutconsult@gmail.com",
        password: hash,
        isAdmin: true,
        admin_id: shortid.generate()
      })
      return res.json({ done: "done" });
    });
  });

  app.get("/addadmin", (req, res) => {

    // let password = "password";

    Admin.create({
      email: "readoutconsult@gmail.com", // change this
      email_confirmed: true,
      password: null,
      isAdmin: true,
      admin_id: shortid.generate(),
      candidatefirst: "Denyse", // change this
      candidatelast: "Wang Stoneback", // change this
      userfirst: "Scott", // change this
      userlast: "Lieber", // change this
      office: "State Representative", // change this
      party: "Democrat", // change this
      state: "IL", // change this
      orgname: "Denyse for State Rep", // change this
      has_file: false,
      date_created: new Date(),
      paid: 0,
      population_size: -1, // based on size of voter file, used to determine cost
      polls: []
    })
    return res.json({ done: "done" });
  });

  app.post("/allpolls", verifyTokenAgent, (req, res) => {

    let id = req.authData.id;

    Agent.findOne({ _id: id }).lean().exec()
    .then((agent) => {
      console.log("agent : ", agent);
      let polls_arr = agent.polls_arr; // should be an array
      let gms_arr = agent.gms_arr;
      return res.json({ polls: polls_arr, gms: gms_arr })
    })
    .catch((err) => {
      console.log("err : ", err);
      return res.json({ error: "There was an error retrieving your polls. Please go back and try again." });
    });
  });

  app.post("/fetchpoll", verifyTokenAgent, (req, res) => {
    // getting back finished: finished, percentagesDeepAllCandidates, candidates_arr, keys, poll_start, poll_end, criteriaArr
    // getting back not finished: finished, number_responded, outstanding, poll_start, follow_up_texts_date, agents
    let poll_id = req.body.poll_id;

    Poll.findOne({ poll_id }).exec()
    .then(async (response) => {
      let poll = response.toObject();
      let finished = poll.finished;
      if (finished) {
        let percentagesDeepAllCandidates = poll.percentagesDeepAllCandidates;
        let candidates = poll.candidates;
        let demographic_info = poll.demographic_info;
        let keys = poll.keys;
        let poll_start = poll.poll_start;
        let poll_end = poll.poll_end;
        let predictive_scores_ready = poll.predictive_scores_ready;
        return res.json({ finished, percentagesDeepAllCandidates, candidates, keys, demographic_info, poll_start, poll_end, predictive_scores_ready });
      }
      else {
        let number_responded = await Voter.countDocuments({ has_cell: true, polls: { $elemMatch: { poll_id, has_responded: true } } });
        let outstanding = await Voter.countDocuments({ has_cell: true, polls: { $elemMatch: { poll_id, has_responded: false } } });
        console.log("number responded : ", number_responded);
        console.log("outstanding : ", outstanding);
        let poll_start = poll.poll_start;
        return res.json({ finished, number_responded, outstanding, poll_start })
      }
    })
    .catch((error) => {
      console.log("error: ", error);
      return res.json({ error: "There was an error retrieving your poll. Please try again." });
    });
  });

  app.post("/createpoll", verifyTokenAgent, (req, res) => {
    console.log("create poll");

    // 1. Change variables up top: poll_id, candidates, phone, parties_arr, month, admin_id
    let admin_id = "hXvcD0Rw";
    let candidates = ["Mark Kalish", "Denyse Wang Stoneback", "Kevin Olickal"];
    let phone = "+13125844156";
    let parties_arr = null;
    let election_month = "March";
    let election_day = "17";
    let primary = true;
    let office = "Congress";

    // let poll_id = shortid.generate();
    let poll_id = "abcdef";
    candidates.push("Other");
    candidates.push("Don't Know/Undecided");
    candidates.push("Not planning to vote");

    // let id = req.authData.id;
    let count;
    let orgname;

    // STEP 1: Make sure there is a voter file
    Admin.findOne({ admin_id }) // putIdHere
    .exec()
    .then((response) => {
      let admin = response.toObject();
      let has_file = admin.has_file;
      // admin_id = admin.admin_id;
      orgname = admin.orgname;

      let update = {
        poll_id,
        phone,
        response: -1,
        predictive_score: -1,
        texts_sent: 0,
        last_sent: null
      }

      if (has_file) {
        throw new Error("You must first upload a voter file before starting a poll.");
      }
      else {
        return Voter.updateMany({ admin_id }, { $push: { polls: update } }).exec();
      }
    })
    .then((update_res) => {
      return Voter.countDocuments({ polls: { $elemMatch: { poll_id } } });
    })
    .then((c) => {
      count = c;
      console.log("c : ", c);
      return Admin.findOneAndUpdate({ admin_id }, { population_size: c, $push: { polls: poll_id }, }).exec();
    })
    .then(() => {
      return Poll.create({
        poll_id,
        admin_id,
        orgname,
        parties_arr,
        candidates,
        phone,
        election_month,
        election_day,
        primary,
        office,
        keys: [],
        population_size: count,
        percentagesDeepAllCandidates: []
      });
    })
    .then((poll_created) => {
      console.log("poll created : ", poll_created);
      return res.json({ success: "success", poll_id })
    })
    .catch((err) => {
      console.log("error : ", err);
      return res.json({ error: err })
    });
  });

  app.post('/login', (req, res) => {

    const email = req.body.username.toLowerCase();
    const pass = req.body.password;

    Agent.findOne({ email }, (err, user) => {
      if (err || !user) {
        console.log(err);
        return res.json({ error: "Unable to log in. Please try again." });
      }

      const password = user.password;
      const id = user._id;

      bcrypt.compare(pass, password, (error, isMatch) => {
        if (error || !isMatch) {
          console.log(error);
          return res.json({ error: "Unable to log in. Please try again." });
        }
        else {
          jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: process.env.EXPIRE }, (err, token) => {
            if (err) {
              console.log("Err : ", err);
              return res.json({ error: "Unable to log in. Please try again." });
            }
            else {
              TokenAgent.create({
                verification_token: token
              })
              .then(() => {
                return res.json({ token });
              })
              .catch((err) => {
                console.log("err : ", err);
                return res.json({ error: "Error logging in. Please try again." });
              })
            }
          })
        }
      });
    });
  });

  app.post("/voterfile", (req, res) => {

    console.log("req.headers : ", req.headers);

    let token = req.headers.bearer;
    console.log("token : ", token);

    jwt.verify(token, process.env.JWT_KEY, async (err, authData) => {
      if (err) {
        console.log("err : ", err);
        return res.sendStatus(403);
      }

      // let id = req.authData.id;
      // let projection = { admin_id: 1, population_size: 1 };
      // const directory = 'public/uploads';
      // const admin_0 = await Admin.findOne({ _id: id }, projection).exec();
      // const admin = admin_0.toObject();
      // let admin_id = admin.admin_id;
      let admin_id = "hXvcD0Rw";
      let len;

      upload(req, res, (err) => {

        if (err) {
          console.log(err);
          return res.json({ error: "Upload error. Please try again." });
        }

        if (req.file == undefined) {
          return res.json({ error: "No file selected. Please select a file." });
        }

        const csvFilePath = "public/uploads/" + req.file.filename;
        filename = req.file.filename;
        csv({
          colParser: {
            "Voter File VANID": 'number',
            "mZip5": 'number',
            "Cell Phone": 'number'
          },
          includeColumns: /Voter File VANID|LastName|FirstName|mZip5|Cell Phone|Party|Gender|DOB/
        })
        .fromFile(csvFilePath)
        .then((jsonObj) => {
          // add items to each record
          len = jsonObj.length;
          let limit = 0;
          let z2 = 0; // change this
          let z3 = 0; // change this
          let z4 = 0; // change this
          let d = 0;
          let r = 0;
          let ind = 0;

          for (let i = 0; i < len; i++) {

            let insertion = {
              poll_id: "abcdef",
              camp_phone: 5555555555,
              predictive_score: -1,
              texts_sent: 0,
              last_sent: null
            }

            let party = jsonObj[i].Party.toLowerCase();
            let gender = jsonObj[i].Gender.toLowerCase();
            let dob_str = jsonObj[i].DOB;
            let dob_arr = dob_str.split("/");
            let year = dob_arr[2];
            let month = dob_arr[0] - 1; // goes from 0-11
            let day = dob_arr[1];
            let dob = new Date(year, month, day);

            jsonObj[i].admin_id = admin_id;
            jsonObj[i].Zip = jsonObj[i].mZip5;
            jsonObj[i].has_cell = jsonObj[i]["Cell Phone"] == "" ? false : true;
            jsonObj[i].polls = [];
            jsonObj[i].party = party.match(/^d/i) ? "d" : party.match(/^r/i) ? "r" : "i";
            jsonObj[i].gender = gender.match(/^m/i) ? "m" : "f";
            jsonObj[i].dob = dob;

            // GENERATING FAKE DATA
            let v;
            // let limit = 0;
            if (jsonObj[i].has_cell && limit < 900) {
              // limit++
              if (jsonObj[i].gender == "f" && jsonObj[i].party == "d" && d < 476) {
                d++;
                limit++;
                insertion.response = Math.random() < 0.3822 ? 0 : 1;
                insertion.has_responded = true;
              }
              else if (jsonObj[i].gender == "f" && jsonObj[i].party == "r" && r < 128) {
                r++;
                limit++;
                insertion.response = Math.random() < 0.5884 ? 0 : 1;
                insertion.has_responded = true;
              }
              else if (jsonObj[i].gender == "f" && jsonObj[i].party == "i" && ind < 300) {
                ind++;
                limit++;
                insertion.response = Math.random() < 0.5001 ? 0 : 1;
                insertion.has_responded = true;
              }
              else if (jsonObj[i].gender == "m" && jsonObj[i].party == "d" && d < 476) {

                d++
                limit++
                insertion.response = Math.random() < 0.4543 ? 0 : 1;
                insertion.has_responded = true;
              }
              else if (jsonObj[i].gender == "m" && jsonObj[i].party == "r" && r < 128) {
                r++;
                limit++
                insertion.response = Math.random() < 0.5830 ? 0 : 1;
                insertion.has_responded = true;
              }
              else if (jsonObj[i].gender == "m" && jsonObj[i].party == "i" && ind < 300) {
                ind++
                limit++
                insertion.response = Math.random() < 0.4060 ? 0 : 1;
                insertion.has_responded = true;
              }
              else {
                insertion.response = -1;
                insertion.has_responded = false;
              }
              jsonObj[i].polls = [insertion];
            }
            else if (jsonObj[i].has_cell && z2 < 20) {
              z2++;
              insertion.response = 2;
              insertion.has_responded = true;
              jsonObj[i].polls = [insertion];
            }
            else if (jsonObj[i].has_cell && z3 < 20) {
              z3++;
              insertion.response = 3;
              insertion.has_responded = true;
              jsonObj[i].polls = [insertion];
            }
            else if (jsonObj[i].has_cell && z4 < 20) {
              z4++;
              insertion.response = 4;
              insertion.has_responded = true;
              jsonObj[i].polls = [insertion];
            }
            else {
              insertion.response = -1;
              insertion.has_responded = false;
              jsonObj[i].polls = [insertion];
            }
            // DELETE ABOVE AND UNCOMMENT-OUT THE LINE BELOW
            // jsonObj[i].polls = [];
            delete jsonObj[i].DOB;
            delete jsonObj[i].Party;
            delete jsonObj[i].Gender;
            delete jsonObj[i].mZip5;
          }

          return Voter.insertMany(jsonObj, { ordered: false });
        })
        .then((v_response) => {
          return Admin.findOneAndUpdate({ _id: id }, { has_file: true })
        })
        .then(() => {
          fs.readdir(directory, (err, files) => {
            console.log("files : ", files);
            if (err) {
              console.log(err);
            }

            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) {
                  console.log(err);
                }
              });
            }
            return res.json({ success: "File successfully uploaded", has_file: true });
          })
        })
        .catch((error) => {
          if (error.code == "11000") {
            let nInserted = error.result ? error.result.result ? error.result.result.nInserted : 0 : 0;
            return res.json({ error: "E11000", nInserted })
            }
          else {
            return res.json({ error: "We're sorry, there was a problem and the voter file was not added. Please try again." });
          }
        });
      });
    });
  });



  app.post("/reset", (req, res) => {
    let email = req.body.email.toLowerCase();
    let query = { email };
    Agent.findOne(query)
    .exec()
    .then(async (user) => {
      const verification_token = randomstring.generate();

      await PasswordresetAgent.create({
        email,
        verification_token
      })

      const html = '<p>Hi!</p><p>You recently requested a password reset for your Readout account.</p><p>Use the following link:</p><p><a href="https://twili.glitch.me/resetpassword/' + verification_token + '">https://twili.glitch.me/resetpassword/' + verification_token + '</a><p>This token will expire after 15 minutes.</p><p>If you did not make this request, please contact us at 708-622-5984 to inform us.</p><p> Have a great day!</p>';


      try {
         await sendEmail("reset@readoutconsult.com", email, "Your password reset request", html);
         res.json({ success: "confirm account" });
       }
       catch (email_err) {
         console.log(email_err);
         res.json({ error: "If an account exists, an email has been sent." })
       }
    })
  });

  app.post('/resetpassword',[
  check('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  check('password').custom((val, {req, loc, path}) => {
    if (val !== req.body.password2) {
      throw new Error("Passwords don't match");
    }
    else {
      return val;
    }
  })
  ],
  checkValidationResult,
  (req, res) => {

    let token = req.body.token;
    let password = req.body.password;
    console.log("token : ", token);

    PasswordresetAgent.findOneAndRemove({ verification_token: token})
    .then((doc) => {
      if (doc) {
        bcrypt.hash(password, 10, (error, hash) => {
          if (error) {
            console.log("bcrypt error : ", error);
            return res.json({ errors: "Registration failed." });
          }

          let query = { email: doc.email };
          let update = { password: hash };
          Agent.findOneAndUpdate(query, update)
          .then(() => {
            res.json({ successes: "Your email address has been confirmed." })
          })
          .catch((err) => {
            return res.json({ "errors": "Unable to update password. Please try again." })
          })
        })
      }

      else {
        return res.json({errors: "Unable to update password. Please try again."})
      }
    })
    .catch((err) => {
      return res.json({ "errors": "Unable to update password. Please try again." })
    })
  });


  // http://expressjs.com/en/starter/basic-routing.html
  app.get("*", (req, res) => {
    res.sendFile(__dirname + '/app/index.html');
  });
}

const checkValidationResult = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
      return next();
  }
  res.json({ error: result.array() });
}

const sendEmail = (from, to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) {
        reject(err);
      } // unsure what to do here! error message: could not send verification email, please try again later
      else {
        resolve(info)
      }
    });
  });
}
