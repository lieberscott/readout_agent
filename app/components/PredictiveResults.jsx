import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, Button, Table } from 'reactstrap';

const PredictiveResults = (props) => {

  const [first, setFirst] = useState(true);
  const [pollId, setPollId] = useState(props.location.state.poll_id);
  const [candidates, setCandidates] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ext, setExt] = useState(null);

  useEffect(() => {
    if (first) {
      populate();
    }
  }, []);

  const populate = () => {
    let poll_id = pollId;
    let token = localStorage.getItem("token");

    fetch("/predictiveresults", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ poll_id, token })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) { // error on the back end
        setFirst(false);
        console.log("json : ", json);
      }

      else {
        let v = json.voters_arr;
        setVoters(v);
        setFirst(false);
      }
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  }

  const createFile = () => {
    let poll_id = pollId;
    let token = localStorage.getItem("token");

    fetch("/predictiveresultscreatefile", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ poll_id, token })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) { // error on the back end
        console.log("json : ", json);
        setError("There was an error creating your file. Please try again.");
        setSuccess("");
      }

      else {
        let ext = json.ext;
        setError("");
        setSuccess("File created. You may click the Download File button now.");
        setExt(ext);
        console.log("downloading?");
      }
    })
    .catch((err) => {
      console.log("err : ", err);
    });
  }

  const handleDownload = () => {
    setSuccess("");
    setError("");
    setExt(null);
  }

  if (first) {
    return <div>Loading...</div>
  }

  else {
    console.log("voters[0] : ", voters[0]);
    return (
      <div>
        { error ? <Alert color="danger">{ error }</Alert> : "" }
        { success ? <Alert color="success">{ success }</Alert> : "" }
        <h1>Predictive Results</h1>
        <p>To get a complete list of all your voters and their scores, first click "Create File". Then a download button will appear.</p>
        <Button onClick={ createFile }>Create File</Button>
        { ext == null ? "" : <a target="_blank" href={ "/predictiveresultsdownload/" + ext }><Button onClick={ handleDownload }>Download</Button></a> }
        <p>Below is a list of 10 of your voters and their score based on how likely they are to support your candidate.</p>
        <p>Scores are from 0 - 100, and the higher the number the more likely they are to support you.</p>
        <Table>
           <thead>
             <tr>
               <th>Voter Name</th>
               <th>Score</th>
             </tr>
           </thead>
           <tbody>
             { voters.map((v, i) => {
               return (
                 <tr>
                  <td>{ v.FirstName + " " + v.LastName }</td>
                  <td>{ v.polls[0].predictive_score }</td>
                 </tr>
               )
             }) }
           </tbody>
         </Table>
      </div>
    );
  }
}

export default PredictiveResults;
