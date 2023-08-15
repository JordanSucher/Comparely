import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

const AccountDetails = () => {
  const userData = useSelector((state) => state.auth.me);

  return (
    <>
      <Container className="d-flex justify-content-center">
        <Card className="w-50">
          <Card.Title className="text-center">Account Details</Card.Title>

          <Card.Body>
            <Row className="justify-content-center">
              <Card.Text as={Col}>Name:</Card.Text>
              <Card.Text as={Col}>{userData.firstName} {userData.lastName}</Card.Text>
            </Row>
            <Row className="justify-content-center">
              <Card.Text as={Col}>Email:</Card.Text>
              <Card.Text as={Col}>{userData.email}</Card.Text>
            </Row>
            <Row className="justify-content-center">
              <Card.Text as={Col}>Company Name:</Card.Text>
              <Card.Text as={Col}>{userData.companyName}</Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>Company URL:</Card.Text>
              <Card.Text as={Col}>{userData.companyUrl}</Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>Competitors:</Card.Text>
              <Card.Text as={Col}>
                Insert Ordered List of tracked competitors
              </Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>Open API Key:</Card.Text>
              <Card.Text as={Col}>{userData.openApiKey}</Card.Text>
            </Row>
            <Row>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Weely Email Comparison Updates"
                />
              </Form>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AccountDetails;
