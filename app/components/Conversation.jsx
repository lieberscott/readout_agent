import React from 'react';
import { useEffect, useState } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';

const Conversation = (props) => {

  const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [voter, setVoter] = useState({

  });
  const [cell, setCell] = useState(props.location.state.cell);
  const [text, setText] = useState("");
  const [voterId, setVoterId] = useState(props.location.state.voter_id);
  const [pollId, setPollId] = useState(props.location.state.poll_id);

  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, []);

  const populate = () => {
    let token = localStorage.getItem("token");
    let voter_id = voterId;

    fetch("/getconvo", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, voter_id, poll_id: pollId })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let messages = json.voter.polls.messages || [];
      let first = json.voter.FirstName;
      let last = json.voter.LastName;
      let cell = json.voter["Cell Phone"];
      setConvo(messages);
      setVoter({...voter, first, last, cell })
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
    let token = localStorage.getItem("token");
    let t = text;
    let poll_id = pollId;
    let text_to = cell;
    // text_from will be picked up serverside
    setText("");

    fetch("/sendmessage", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, text: t, vanid: voterId, poll_id, text_to })
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

  if (first) {
    return <div>Loading...</div>
  }

  else {
    return (
      <div>
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
      </div>
    )
  }
};

export default Conversation;
