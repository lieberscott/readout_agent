import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';

const PollInfiniteScrollItem = (props) => {

  const [redirect, setRedirect] = useState(false);

  const handleRedirect = (e) => {
    let convo = e.target.getAttribute("poll_id");
    setRedirect(true);
  }

  let poll_index = props.voter.polls.findIndex((el) => props.poll_id == el.poll_id);

  if (redirect) {
    return <Redirect to={{
            pathname: '/conversation',
            state: { voter_id: props.voter["Voter File VANID"], poll_id: props.poll_id, cell: props.voter["Cell Phone"] }
        }}/>
  }
    return (
      <tr onClick={ handleRedirect }>
        <th scope="row">{ props.voter.polls[poll_index].messages.length ? props.voter.polls[poll_index].messages[0].read ? "" : "Blue dot" : "" }</th>
        <td><Row>{ props.voter.FirstName + " " + props.voter.LastName }</Row><Row>{ props.voter.polls[poll_index].messages.length ? props.voter.polls[poll_index].messages[0].content : "Tap to initiate conversation" }</Row></td>
        <td>{ props.voter.date_of_last_message }</td>
      </tr>
    );
  }

export default PollInfiniteScrollItem;
