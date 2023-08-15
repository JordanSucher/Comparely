import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../app/store";
import { Container, Form, Row, Col, Button, InputGroup } from "react-bootstrap";

const Login = ({ name, displayName, setForm }) => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    const formName = e.target.name;
    const email = e.target.email.value;
    const password = e.target.password.value;
    dispatch(authenticate({ email, password, method: formName }),  navigate('/'));
  };

  return (
    <Container className="d-flex justify-content-center w-75 mt-5 mb-5">
      <Form onSubmit={handleSubmit} name={name} className="w-50 mt-5">
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text id="email">Email</InputGroup.Text>
            <Form.Control aria-label="email" type="email" name="email" />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text id="password">Password</InputGroup.Text>
            <Form.Control
              aria-label="password"
              type="password"
              name="password"
            />
          </InputGroup>
        </Form.Group>

        <Container className="d-flex justify-content-center mb-3">
          <Button className="me-2" type="submit">{displayName}</Button>
          <Button onClick={() => setForm(false)}>Create account?</Button>
        </Container>
        {/* {error & <Container>{error}</Container>} */}
      </Form>
    </Container>
  );
};

export default Login;
