import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Button, Row } from 'reactstrap';

import PollInfiniteScroll from './PollInfiniteScroll';

const Poll = (props) => {

  const [voters, setVoters] = useState([]);
  const [pollId, setPollId] = useState(props.location.state.poll_id);
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setRedirect(true);
  }

  if (redirect) {
    return <Redirect to={{
            pathname: '/initiateconversations',
            state: { poll_id: pollId }
        }}/>
  }

  return (
    <div>
      <h4>Your Conversations</h4>
      <Button onClick={ handleRedirect }>Initiate Mode</Button>
      <p>Press button to enter Initiate Mode</p>
      <Table>
        <tbody>
          <PollInfiniteScroll poll_id={ pollId } />
        </tbody>
      </Table>
    </div>
  )
};

export default Poll;
