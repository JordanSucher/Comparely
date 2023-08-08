import React from "react";
import {Row, Col, Form, Button, Table, Container} from "react-bootstrap";

const CreateProfile = () => {
  return(
    <>
    <Container>
      <Form>
        <Row className="mt-3">
          <Form.Group as={Col} controlId="formGridFirstName" className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="firstName" placeholder="First Name" />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLastName" className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="lastName" placeholder="Last Name" />
          </Form.Group>
        </Row>

        <Form.Group controlId="formGridPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>

        <Form.Group controlId="formGridEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formGridCompany" className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control type="company" placeholder="Enter company name" />
        </Form.Group>

        <Form.Group controlId="formGridCompanyUrl" className="mb-3">
          <Form.Label>Company Url</Form.Label>
          <Form.Control type="companyUrl" placeholder="Enter company Url" />
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>

      </Form>
      </Container>
    </>
  )
  }

export default CreateProfile;
