import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Button, Row } from 'reactstrap';

import GmInfiniteScroll from './GmInfiniteScroll';

const Gm = (props) => {

  const [voters, setVoters] = useState([]);
  const [gmId, setGmId] = useState(props.location.state ? props.location.state.gm_id : "");
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setRedirect(true);
  }

  if (redirect) {
    return <Redirect to={{
            pathname: '/initiateconversations2',
            state: { gm_id: gmId }
        }}/>
  }

  return (
    <div>
      <h4>Your Conversations</h4>
      <Button onClick={ handleRedirect }>Initiate Mode</Button>
      <p>Press button to enter Initiate Mode</p>
      <Table>
        <tbody>
          <GmInfiniteScroll gm_id={ gmId } />
        </tbody>
      </Table>
    </div>
  )
};

export default Gm;
