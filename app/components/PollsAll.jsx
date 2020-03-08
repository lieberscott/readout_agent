import React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Card, CardTitle, CardText, Row, Button } from 'reactstrap';

const AllPolls = () => {

  const [first, setFirst] = useState(true);
  const [polls, setPolls] = useState([]);
  const [gms, setGms] = useState([]);
  const [redirectPoll, setRedirectPoll] = useState(false);
  const [redirectGm, setRedirectGm] = useState(false);
  const [pollId, setPollId] = useState(null);
  const [gmId, setGmId] = useState(null);

  useEffect(() => {
    if (first == true) {
      populate();
    }
    else {
      // do nothing
    }

  }, [polls]);

  const populate = () => {
    const token = localStorage.getItem("token");

    fetch("/allpolls", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      const polls = json.polls;
      const gms = json.gms;
      setPolls(polls);
      setGms(gms);
      setFirst(false);
    })
    .catch((err) => { console.log("err : ", err) });
  }

  const handlePoll = (e) => {
    const poll_id = e.target.getAttribute("poll_id");
    setPollId(poll_id);
    setRedirectPoll(true);
  }

  const handleGm = (e) => {
    const gm_id = e.target.getAttribute("gm_id");
    setGmId(gm_id);
    setRedirectGm(true);
  }

  if (first) {
    return <div>Loading...</div>
  }

  else if (redirectPoll) {
    return <Redirect to={{
            pathname: '/poll',
            state: { poll_id: pollId }
        }}/>
  }

  else if (redirectGm) {
    return <Redirect to={{
            pathname: '/gm',
            state: { gm_id: gmId }
        }}/>
  }

  else {
    return (
      <div>
        <a href="#"><Button>Your account</Button></a>
        <h4>Your Polls</h4>
        <Row>
        { polls.map((poll, i) => {
          return (
            <Col sm="6">
              <Card body>
                <CardTitle>{ poll.orgname }</CardTitle>
                <CardText>Poll start date: { poll.poll_start }</CardText>
                <Button poll_id={ poll.poll_id } onClick={ handlePoll }>Go somewhere</Button>
              </Card>
            </Col>
          )
        }) }
        </Row>
        <h4>General Message Campaigns</h4>
        <Row>
        { gms.map((gm, i) => {
          return (
            <Col sm="6">
              <Card body>
                <CardTitle>{ gm.orgname }</CardTitle>
                <CardText>Poll start date: { gm.poll_start }</CardText>
                <Button gm_id={ gm.gm_id } onClick={ handleGm }>Go somewhere</Button>
              </Card>
            </Col>
          )
        }) }
        </Row>
      </div>
    )
  }
};

export default AllPolls;
