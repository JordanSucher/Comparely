import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Center = () => {
  return(
    <>
    {/* <Row>
      <Col>
      <p className="d-flex justify-content-center">Center</p>
      </Col>
    </Row> */}
    <Stack>
      <Form className="d-flex justify-content-center">
        <Form.Group>
          <Form.Label>
            What is your Company's URL?
          </Form.Label>
          <Form.Control></Form.Control>
        </Form.Group>
      </Form>
    </Stack>
    </>
  )
}


export default Center;
