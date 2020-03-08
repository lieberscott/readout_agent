import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PollInfiniteScrollItem from './PollInfiniteScrollItem';

import { useState, useEffect } from 'react';

const PollInfiniteScroll = (props) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: [],
    start: 0 // where to start the mongodb search
  });
  const [pollId, setPollId] = useState(props.poll_id)

  useEffect(() => {
    if (values.first == true) { // page is rendering for first time
      getResponses();
    }
    else {
      console.log("not first poll detail single scrollbox");
    }
  }, [values]);

  const getResponses = () => {
    console.log("get responses");
    let token = localStorage.getItem("token");
    let start = 0; // on click, start over
    let poll_id = pollId; // "4382194314"

    fetch("/getvoters", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, start, poll_id })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let voters = json.voters || [];
      setValues({ ...values, first: false, voters, start: 100 });
    })
  }

  const getMoreResponses = () => {
    // get more responses on scroll

    console.log("get more responses");

    let token = localStorage.getItem("token");
    let poll_id = pollId; // "4382194314"

    let start = values.start;
    console.log("start : ", start);

    fetch("/getvoters", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, poll_id, start })
    })
    .then((res) => res.json())
    .then((json) => {
      setValues({ ...values, voters: values.voters.concat(json.voters), start: values.start + 100 });
    })
  }

    return (
        <InfiniteScroll
          dataLength={ values.voters.length }
          next={ getMoreResponses }
          hasMore={ true }
          loader={ <h4>Loading...</h4>}
          >
          { values.voters.map((voter, i) => {
            return (
              <PollInfiniteScrollItem poll_id={ pollId } key={ voter["Voter File VANID"] } voter={ voter } />
            )
          }) }
        </InfiniteScroll>
    );
  }

export default PollInfiniteScroll;
