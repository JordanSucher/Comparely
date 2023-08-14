import React from "react";
import { Row, Col, Form, Button, Table, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../app/store";

const CreateAccountForm = ({ name, displayName, setForm }) => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formName = e.target.name;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const company = e.target.company.value;
    const companyUrl = e.target.companyUrl.value;
    dispatch(
      authenticate({
        firstName,
        lastName,
        email,
        password,
        company,
        companyUrl,
        method: formName,
      })
    );
  };

  return (
    <>
      <Container>
        <h4 className="mt-5">Create Account</h4>
        <Form onSubmit={handleSubmit} name={name}>
          <Row className="mt-3">
            <Form.Group as={Col} controlId="firstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="firstName" placeholder="First Name" />
            </Form.Group>
            <Form.Group as={Col} controlId="lastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="lastName" placeholder="Last Name" />
            </Form.Group>
          </Row>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="company" className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control type="company" placeholder="Enter company name" />
          </Form.Group>

          <Form.Group controlId="companyUrl" className="mb-3">
            <Form.Label>Company Url</Form.Label>
            <Form.Control type="companyUrl" placeholder="Enter company Url" />
          </Form.Group>

          <Button variant="primary" type="submit">
            {displayName}
          </Button>
          {error & <Container>{error}</Container>}
        </Form>
        <Button onClick={() => setForm(true)}>Returning Customer?</Button>
      </Container>
    </>
  );
};

export default CreateAccountForm;
