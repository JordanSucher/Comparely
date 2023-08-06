import React from "react";
import { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Homeski = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    let comparisonData = axios.post("/api/comparisons", {
      companies: competitors,
    });
  };

  const handleChange = (event) => {
    let index = parseInt(event.target.getAttribute("index"));
    let newCompetitors = [...competitors];
    newCompetitors[index] = event.target.value;
    setCompetitors(newCompetitors);
  };

  const handleDelete = (event) => {
    let index = parseInt(event.target.getAttribute("index"));
    let newCompetitors = [...competitors];
    console.log("newCompetitors", newCompetitors);
    newCompetitors = newCompetitors.filter((competitor, i) => {
      return i !== index;
    });
    setCompetitors(newCompetitors);
  };

  const [competitors, setCompetitors] = useState([""]);

  return (
    <>
      <Container className="text-center p-3">
        <h1>Compare.ly</h1>
        <p>Easily keep track of your competitors.</p>
      </Container>
      <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
        <Form.Group className="mb-3" controlId="companyURL">
          <Form.Label className="mb-1">What is your company's URL?</Form.Label>
          <Stack direction="horizontal" gap={1}>
            <Form.Control
              type="url"
              placeholder="Enter your website"
              className="w-75"
            />
            <Button>+</Button>
          </Stack>
        </Form.Group>
      </Form>
    </>
  );
};

export default Homeski;
