import React from 'react';
import { useState, useEffect } from 'react';

import { Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import stylesheet from './myStyles.css';

const ResetPassword = (props) => {

  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e) => {
    e.persist();
    setValues((values) => ({ ...values, [e.target.name]: e.target.value }));
  };


  const resetpassword = (e) => {
    e.preventDefault();
    let url = window.location.href;
    let token = url.split("/resetpassword/")[1];
    let password = values.password;
    let password2 = values.password2;

    fetch("/resetpassword", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password, password2 })
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setSuccess("")
        setError("Could not reset password. Please try again.");
      }
      else {
        console.log("successes");
        setError("")
        setSuccess("Your password has been reset.")
      }
    })
    .catch((err) => { console.log("err : ", err) });
  }

  return (
    <div>
      { error ? <Alert color="danger"> { error } </Alert> : "" }
      { success ? <Alert color="success"> { success } </Alert> : "" }
      <Row className="justify-content-center">
        <Col className="col-md-6">
          <Form className={ stylesheet.form } onSubmit={ (e) => resetpassword(e) }>
            <FormGroup>
              <Label>New Password</Label>
              <Input className="input" type="password" name="password" onChange={ handleChange } value={ values.password || "" } required />
            </FormGroup>
            <FormGroup>
              <Label className="label">Confirm New Password</Label>
              <Input className="input" type="password" name="password2" onChange={ handleChange } value={ values.password2 || "" } required />
            </FormGroup>
            <Button type="submit" color="primary">Reset Password</Button>
          </Form>
          <Button type="button" color="secondary" onClick={() => { props.history.push("/login")}}>Return to Login</Button>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
