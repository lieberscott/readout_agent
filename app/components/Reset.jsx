import React from 'react';
import { Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { useState, useEffect } from 'react';

import stylesheet from './myStyles.css';

const Login = (props) => {

  const [values, setValues] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    e.persist();
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const request = (e) => {
    e.preventDefault();
    let email = values.email;

    fetch("/reset", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then((res) => {
      setMessage("An email has been sent.")
    })
    .catch((err) => { console.log("err : ", err) });
  }

  return (
    <div>
      { message ? <Alert color="info"> { message } </Alert> : "" }
      <Row className="justify-content-center">
        <Col className="col-md-6">
          <Form className={ stylesheet.form } onSubmit={ (e) => request(e) }>
            <FormGroup>
              <Label className="label">Email Address</Label>
              <Input className="input" type="email" name="email" onChange={ handleChange } value={ values.email || "" } required />
            </FormGroup>
            <Button type="submit" color="primary">Request Password Reset</Button>
          </Form>
          <Button type="button" color="secondary" onClick={() => { props.history.push("/login")}}>Return to Login</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
