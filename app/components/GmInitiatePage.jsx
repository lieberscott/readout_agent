import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import GmInitiateConversation from './GmInitiateConversation';
import GmInfiniteScrollItem from './PollInfiniteScrollItem';

import { useState, useEffect } from 'react';

const GmInitiatePage = (props) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: []
  });
  const [gmId, setGmId] = useState(props.location.state ? props.location.state.gm_id : "");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (values.first == true) { // page is rendering for first time
      getVoters();
    }
    else {
      console.log("not first poll detail single scrollbox");
    }
  }, [values]);

  const getVoters = () => {
    console.log("get uninitiated voters");
    const token = localStorage.getItem("token");
    const gm_id = gmId;
    console.log("gmId : ", gmId);

    fetch("/getvotersinitiategm", { // only voters for whom there is no messages, 1000 at a time
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id })
    })
    .then((res) => res.json())
    .then((json) => {
      const voters = json.voters || [];
      setValues({ ...values, first: false, voters });
    })
  }

  const increment = () => {
    console.log("increment called");
    setI(i + 1);
  }

  if (values.first == true) {
    return <div>Loading...</div>
  }

  else if (values.voters.length == 0) {
    return <div>All voters have been initiated! Congratulations! Now await responses!</div>
  }

  else if (i > values.voters.length - 1) {
    return <div>You have completed this batch of 1000. Refresh to get a new batch of another 1000 :)</div>
  }

  else {
    console.log("values.voters[i] : ", values.voters[i]);
    return (
      <div>
        <GmInitiateConversation
          gm_id={ gmId }
          voter={ values.voters[i] }
          increment={ () => increment() }
        />
      </div>
    );
  }
}

export default GmInitiatePage;
