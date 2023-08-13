import React from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

const AccountDetails = () => {
  return(
    <>
    <Container className="d-flex justify-content-center">
        <Card className="w-50">

          <Card.Title className="text-center">Account Details</Card.Title>

          <Card.Body>
            <Row className="justify-content-center">
              <Card.Text as={Col}>
                Name:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Full Name
              </Card.Text>
            </Row>
            <Row className="justify-content-center">
              <Card.Text as={Col}>
                Email:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Email
              </Card.Text>
            </Row>
            <Row className="justify-content-center">
              <Card.Text as={Col}>
                Company Name:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Company Name
              </Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>
                Company URL:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Company URL
              </Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>
                Competitors:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Ordered List of tracked competitors
              </Card.Text>
            </Row>
            <Row>
              <Card.Text as={Col}>
                Open API Key:
              </Card.Text>
              <Card.Text as={Col}>
                Insert Open API Key
              </Card.Text>
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
  )
}

export default AccountDetails;
