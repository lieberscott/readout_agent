import React from 'react';
import { useEffect, useState } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';

const InitiateConversation = (props) => {

  // const [first, setFirst] = useState(true);
  const [convo, setConvo] = useState([]);
  const [cell, setCell] = useState("");
  const [text, setText] = useState("");
  const [voterId, setVoterId] = useState("");
  const [pollId, setPollId] = useState("");
  const [mixedResArr, setMixedResArr] = useState([]);

  useEffect(() => {
    setCell(props.voter["Cell Phone"]);
    setVoterId(props.voter["Voter File VANID"]);
    setPollId(props.poll_id);
    setMixedResArr([]);
    setText("");
  }, [props])

  const handleChange = (e) => {
    e.persist();
    setText(e.target.value);
  };

  const handleInitiate = (e) => {
    e.persist();

    let token = localStorage.getItem("token");
    let voter_id = voterId;

    fetch("/initiatemessage", {
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
      let votername = json.votername;
      let name = json.name; // Agent name (Scott)
      let month = json.month;
      let day = json.day;
      let office = json.office;
      let primary = json.primary; // Boolean
      let candidates = json.candidates;
      let candidates_copy = [...candidates];
      let orgname = json.orgname;

      console.log("candidates pre mixed : ", candidates);
      // create mixed_res_arr
      let len = candidates.length;
      let cands0 = candidates.splice(len - 3, len - 1); // last three elements of array: ["Another candidate", "Unsure", "Not planning to vote"];
      // candidates is just an array of the named candidates, since `splice` changes the contents of the array it is called on

      let mixed_res_arr = []; // will be array of indexes: [1, 0, 2]
      // first put mixed_res_arr in order
      for (let l = 0; l < candidates.length; l++) {
        mixed_res_arr.push(l); // [0, 1, 2]
      }

      // second, mix mixed_res_arr
      for (let i = mixed_res_arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixed_res_arr[i], mixed_res_arr[j]] = [mixed_res_arr[j], mixed_res_arr[i]];
      }
      // mixed_res_arr now mixed: [2, 0, 1]
      let message = "Hi " + votername + ",\nMy name is " + name + ", I'm with the " + orgname + " campaign, and we're conducting a poll on the ";
      message = primary ? message + "primary " : message;
      message = message + "race for " + office + ". If you have a moment to participate, we would very much appreciate it.\nPlease respond with your preference below.\n\n";


      for (let k = 0; k < candidates.length; k++) {
        let index = mixed_res_arr[k]; // will be a number like 2
        message = message + 'Reply "' + (k + 1) + '" if you are planning to vote for ' + candidates[index] + "\n";
      }

      message = message + 'Reply "' + (candidates.length + 1) + '" if you are planning to vote for a different candidate\n';
      message = message + 'Reply "' + (candidates.length + 2) + '" if you are Unsure/Undecided on who to vote for\n';
      message = message + 'Reply "' + (candidates.length + 3) + '" if you are not planning to vote\n';

      message += "\nIf you would like to stop receiving texts from us, you can simply reply 'STOP' and you will be removed from our list.\n\nThank you and have a good day.";

      // add last three responses (which will always be in same order) to mixed_res_arr
      for (let m = 0; m < 3; m++) {
        mixed_res_arr.push(mixed_res_arr.length); // [2, 0, 1, 3, 4, 5] <-- indexes of candidates arr (in Poll schema)
      }
      setMixedResArr(mixed_res_arr);
      setText(message);
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  };

  const handleSend = (e) => {
    e.persist();
    let token = localStorage.getItem("token");
    let t = text;
    let poll_id = pollId;
    let text_to = cell;
    let mixed_res_arr = mixedResArr;
    // text_from will be picked up serverside
    setText("");

    fetch("/sendmessage", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, mixed_res_arr, text: t, voter_id: voterId, poll_id, text_to })
    })
    .then((res) => res.json())
    .then((json) => {
      console.log("json : ", json);
      let message = json.message;
      console.log("before increment");
      props.increment();
    })
    .catch((err) => {
      console.log("err : ", err);
    });

  };


  return (
    <div>
      <h4>{ props.voter.FirstName } { props.voter.LastName }</h4>
      <h5>{ props.voter["Cell Phone"] }</h5>
      { convo.length ? convo.map((c, i) => {
        return (
          <Row>
            <div>{c.content}</div>
          </Row>
        )
      }) : <div><Button onClick={ handleInitiate }>Initiate</Button><div>Press initiate, then Send, to initiate conversation</div></div> }
      <Input type="textarea" name="text" onChange={ handleChange } value={ text || "" }  />
      <Button onClick={ handleSend }>Send</Button>
    </div>
  )
};

export default InitiateConversation;
