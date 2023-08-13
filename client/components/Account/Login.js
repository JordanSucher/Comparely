import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "./authSlice";
import { Container, Form, Row, Col, Button } from "react-bootstrap";

const Login = ({ name, displayName, setForm }) => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formName = e.target.name;
    const email = e.target.email.value;
    const password = e.target.password.value;
    dispatch(authenticate({ email, password, method: formName }));
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} name={name}>
        <Form.Group as={Row}>
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Container>
          <Button type="submit">{displayName}</Button>
        </Container>
        {error & <Container>{error}</Container>}
      </Form>
      <Button onClick={() => setForm(false)}>Create account?</Button>
    </Container>
  );
};

export default Login;
