import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'reactstrap';
import { Route, BrowserRouter, hasHistory, Redirect, Switch } from 'react-router-dom';

/* Import Components */
import Conversation from './components/Conversation';
import Gm from './components/Gm';
import GmConversation from './components/GmConversation';
import GmInitiatePage from './components/GmInitiatePage';
import Header from './components/Header';
import InitiatePage from './components/InitiatePage';
import Login from './components/Login';
import Poll from './components/Poll';
import PollsAll from './components/PollsAll';
import Reset from './components/Reset';
import ResetPassword from './components/ResetPassword';

const PrivateRoute = ({ component: Component, ...rest }) => {

  console.log("private route ...rest : ", rest);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // send jwt to API to see if it's valid
    let token = localStorage.getItem("token");
    if (token) {
      fetch("/protected", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      .then((res) => {
        console.log("res : ", res);
        if (res.status == 403) {
          setIsAuth(false);
          localStorage.removeItem("token");
          setIsTokenValidated(true);
        }
        else {
          setIsAuth(true);
          setIsTokenValidated(true);
        }
      })
      .catch((err) => {
        setIsTokenValidated(true); // redirect to login
      });
    }
    else {
       setIsTokenValidated(true); // in case there is no token
    }
  }, [])

  if (!isTokenValidated) {
    return <div>Loading...</div>
  };

  return (<Route {...rest}
    render={(props) => {
      return isAuth ? <Component {...props} /> : <Redirect to={{
            pathname: '/login',
            state: { error: "Session invalid or has expired. Please log in again." }
        }} />
    }} />)
  }

const App = () => {

  return (
    <Container>
      <Header/>
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/conversation" component={ Conversation }/>
          <PrivateRoute exact path="/conversation2" component={ GmConversation }/>
          <PrivateRoute exact path="/gm" component={ Gm }/>
          <PrivateRoute exact path="/poll" component={ Poll }/>
          <PrivateRoute exact path="/allpolls" component={ PollsAll }/>
          <PrivateRoute exact path="/initiateconversations" component={ InitiatePage } />
          <PrivateRoute exact path="/initiateconversations2" component={ GmInitiatePage }/>
          <Route exact path="/login" component={ Login } />
          <Route exact path="/reset" component={ Reset }/>
          <Route exact path="/resetpassword/:id" component={ ResetPassword }/>
        </Switch>
      </BrowserRouter>
    </Container>
    )
}

ReactDOM.render((<App/>), document.getElementById('main'));
