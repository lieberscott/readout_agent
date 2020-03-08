import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import GmInfiniteScrollItem from './GmInfiniteScrollItem';

import { useState, useEffect } from 'react';

const GmInfiniteScroll = (props) => {

  const [values, setValues] = useState({
    first: true, // first time component is loading?
    voters: [],
    start: 0 // where to start the mongodb search
  });
  const [gmId, setGmId] = useState(props.gm_id);

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
    let gm_id = gmId; // "4382194314"

    fetch("/getvotersgm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, start, gm_id })
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
    let gm_id = gmId; // "4382194314"

    let start = values.start;
    console.log("start : ", start);

    fetch("/getvotersgm", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, gm_id, start })
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
              <GmInfiniteScrollItem gm_id={ gmId } key={ voter["Voter File VANID"] } voter={ voter } />
            )
          }) }
        </InfiniteScroll>
    );
  }

export default GmInfiniteScroll;
