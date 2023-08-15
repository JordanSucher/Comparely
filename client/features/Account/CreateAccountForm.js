import React from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Container,
  InputGroup,
} from "react-bootstrap";
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
    const companyName = e.target.companyName.value;
    const companyUrl = e.target.companyUrl.value;
    const openApiKey = e.target.openApiKey.value;
    dispatch(
      authenticate({
        firstName,
        lastName,
        email,
        password,
        companyName,
        companyUrl,
        openApiKey,
        method: formName,
      })
    );
  };

  return (
    <>
      <Container className="w-75 mt-5 mb-5">

        <h4 className="mt-5 mb-4 text-center">Create Account</h4>

        <Form onSubmit={handleSubmit} name={name}>
          <Row className="mt-3">
            <Form.Group as={Col} controlId="firstName" className="mb-3">
              <InputGroup>
                <InputGroup.Text id="firstName">First Name</InputGroup.Text>
                <Form.Control
                  aria-label="firstName"
                  type="firstName"
                  name="firstName"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} controlId="lastName" className="mb-3">
              <InputGroup>
                <InputGroup.Text id="lastName">last Name</InputGroup.Text>
                <Form.Control
                  aria-label="lastName"
                  type="lastName"
                  name="lastName"
                />
              </InputGroup>
            </Form.Group>
          </Row>

          <Form.Group controlId="password" className="mb-3">
            <InputGroup>
              <InputGroup.Text id="password">Password</InputGroup.Text>
              <Form.Control
                aria-label="password"
                type="password"
                name="password"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <InputGroup>
              <InputGroup.Text id="email">Email</InputGroup.Text>
              <Form.Control aria-label="email" type="email" name="email" />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="companyName" className="mb-3">
            <InputGroup>
              <InputGroup.Text id="companyName">Company</InputGroup.Text>
              <Form.Control
                aria-label="companyName"
                type="companyName"
                name="companyName"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="companyUrl" className="mb-3">
            <InputGroup>
              <InputGroup.Text id="companyUrl">Company Url</InputGroup.Text>
              <Form.Control
                aria-label="companyUrl"
                type="companyUrl"
                name="companyUrl"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="openApiKey" className="mb-3">
            <InputGroup>
              <InputGroup.Text id="openApiKey">Open Api Key:</InputGroup.Text>
              <Form.Control
                aria-label="openApiKey"
                type="openApiKey"
                name="openApiKey"
              />
            </InputGroup>
          </Form.Group>

          <Container className="d-flex justify-content-center mt-3">
            <Button className="me-3" variant="success" type="submit">
              {displayName}
            </Button>
              <Button onClick={() => setForm(true)}>Returning Customer?</Button>
          </Container>
          {/* {error & <Container>{error}</Container>} */}
        </Form>
      </Container>
    </>
  );
};

export default CreateAccountForm;
