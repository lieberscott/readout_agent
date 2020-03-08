import React from 'react';
import { useEffect, useState } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';

const GmConversation = (props) => {

  const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [voter, setVoter] = useState({

  });
  const [cell, setCell] = useState(props.location.state ? props.location.state.cell : "");
  const [text, setText] = useState("");
  const [voterId, setVoterId] = useState(props.location.state ? props.location.state.voter_id : "");
  const [gmId, setGmId] = useState(props.location.state ? props.location.state.gm_id : "");
  const [rsvps_boolean, setRsvps_boolean] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, []);

  const populate = () => {
    const token = localStorage.getItem("token");
    const voter_id = voterId;
    const gm_id = gmId;

    fetch("/getconvogm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, voter_id, gm_id })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let messages = json.voter.general_messages.messages || [];
      let first = json.voter.FirstName;
      let last = json.voter.LastName;
      let cell = json.voter["Cell Phone"];
      let rsvps_boolean = json.rsvps_boolean;
      setConvo(messages);
      setVoter({...voter, first, last, cell });
      setRsvps_boolean(rsvps_boolean);
      setFirst(false);
    })
    .catch((err) => {
      console.log("err : ", err)
    });
  }

  const handleChange = (e) => {
    e.persist();
    setText(e.target.value);
  };

  const handleSend = (e) => {
    e.persist();
    const token = localStorage.getItem("token");
    const t = text;
    const gm_id = gmId;
    const text_to = cell;
    // text_from will be picked up serverside
    setText("");

    fetch("/sendmessagegm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, vanid: voterId, gm_id, text_to })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let message = json.message;
      setConvo(convo.push(message));
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  };

  const rsvpYes = () => {
    const token = localStorage.getItem("token");
    const gm_id = gmId;
    const voter_id = voterId;

    fetch("/rsvpyes", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id, voter_id })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        setError(json.error);
        setSuccess("");
      }
      else {
        setError("");
        setSuccess(json.success);
      }
    })
    .catch((err) => {
      setError(json.error);
      setSuccess("");
      console.log("err : ", err);
    });
  }

  const rsvpNo = () => {
    const token = localStorage.getItem("token");
    const gm_id = gmId;
    const voter_id = voterId;

    fetch("/rsvpno", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id, voter_id })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        setError(json.error);
        setSuccess("");
      }
      else {
        setError("");
        setSuccess(json.success);
      }
    })
    .catch((err) => {
      setError(json.error);
      setSuccess("");
      console.log("err : ", err);
    });
  }


  if (first) {
    return <div>Loading...</div>
  }

  else {
    return (
      <div>
        { error ? <Alert color="danger">{ error }</Alert> : "" }
        { success ? <Alert color="success">{ success }</Alert> : "" }
        <a href="#"><Button>Your account</Button></a>
        <h4>Conversation</h4>
        <h5>{ voter.first } { voter.last }, { voter.cell }</h5>
        { convo.length ? convo.map((c, i) => {
          return (
            <Row>
              <div>{c.content}</div>
            </Row>
          )
        }) : "" }
        <Input type="textarea" name="text" onChange={ handleChange } value={ text || "" }  />
        <Button onClick={ handleSend }>Send</Button>
        { rsvps_boolean ? <div><Button onClick={ rsvpYes }>RSVP Yes</Button><Button onClick={ rsvpNo }>RSVP No</Button></div> : "" }
      </div>
    )
  }
};

export default GmConversation;
