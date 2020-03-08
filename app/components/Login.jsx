import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';

import stylesheet from './myStyles.css';

const Login = (props) => {

  const [values, setValues] = useState({});
  const [errors, setErrors] = props.location.state ? useState([props.location.state.error]) : useState([]);
  const [redirect, setRedirect] = useState(false);

  const useEffect = (() => { }, [redirect])

  const handleChange = (e) => {
    e.persist();
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };


  const login = (e) => {
    e.preventDefault();
    let email = values.username;
    let pass = values.password;

    fetch("/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, password: pass })
    })
    .then((res) => {
      if (res.redirected) {
        setErrors(["Incorrect email or password."]);
      }
      else {
        return res.json()

    .then((json) => {
      if (json.errors) {
        setErrors(json.errors);
      }
      else {
        let token = json.token;
        localStorage.setItem("token", token);
        setRedirect(true);
        // setRedirect(true);
      }
    })
    .catch((err) => { console.log("err : ", err) });
      }
  })
  .catch((err) => { console.log("err : ", err) })
  };

  if (redirect) {
    return <Redirect to="/allpolls" />
  }

  return (
    <div>
      { errors.map((error) => (
        <Alert color="danger"> { error } </Alert>
        )
      )}
      <Row className="justify-content-center">
        <Col md="6">
          <Form className={ stylesheet.form } onSubmit={ (e) => login(e) }>
            <FormGroup>
              <Label for="username">Email Address</Label>
              <Input className="input" type="email" name="username" onChange={ handleChange } value={ values.username || "" } required />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input className="input" type="password" name="password" onChange={ handleChange } value={ values.password || "" } required />
            </FormGroup>
            <Button type="submit" color="primary">Login</Button>
            <a href="/reset"><Button type="button" color="secondary">Forgot Password</Button></a>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
