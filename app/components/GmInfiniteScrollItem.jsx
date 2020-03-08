import React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';

const GmInfiniteScrollItem = (props) => {

  const [redirect, setRedirect] = useState(false);

  const handleRedirect = (e) => {
    let convo = e.target.getAttribute("gm_id");
    setRedirect(true);
  }

  let gm_index = props.voter.general_messages.findIndex((el) => props.gm_id == el.gm_id);

  if (redirect) {
    return <Redirect to={{
            pathname: '/conversation2',
            state: { voter_id: props.voter["Voter File VANID"], gm_id: props.gm_id, cell: props.voter["Cell Phone"] }
        }}/>
  }
    return (
      <tr onClick={ handleRedirect }>
        <th scope="row">{ props.voter.general_messages[gm_index].messages.length ? props.voter.general_messages[gm_index].messages[0].read ? "" : "Blue dot" : "" }</th>
        <td><Row>{ props.voter.FirstName + " " + props.voter.LastName }</Row><Row>{ props.voter.general_messages[gm_index].messages.length ? props.voter.general_messages[gm_index].messages[0].content : "Tap to initiate conversation" }</Row></td>
        <td>{ props.voter.date_of_last_message }</td>
      </tr>
    );
  }

export default GmInfiniteScrollItem;
