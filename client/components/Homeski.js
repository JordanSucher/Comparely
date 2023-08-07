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
      <div className="bg-primary bg-gradient text-white">
        <Container className="text-center p-3">
          <h1>Compare.ly</h1>
          <p>Easily keep track of your competitors.</p>
        </Container>

        <Container className="d-flex flex-column justify-content-center align-items-center">
          <Form onSubmit={handleSubmit}>
            {/* company URL form */}
            <Form.Group className="mb-3" controlId="companyURL">
              <Form.Label className="mb-1">
                What is your company's URL?
              </Form.Label>
              <Stack direction="horizontal" gap={1}>
                <Form.Control
                  type="url"
                  name="usersWebsite"
                  placeholder="Enter your website"
                  className="w-75"
                />
                <Button className="bg-dark">+</Button>
              </Stack>
            </Form.Group>

            {/*  competitor form Group */}
            <Form.Group>
              <Form.Label>Who are your competitor's?</Form.Label>
              {competitors.map((row, index) => {
                return (
                  <Form.Group key={index}>
                    <Stack direction="horizontal" gap={1}>
                      <Form.Label htmlFor={"competitorsWebsite" + (index + 1)}>
                        {`Competitor ${index + 1} Website`}
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name={"competitorsWebsite" + (index + 1)}
                        index={index}
                        onChange={handleChange}
                        value={competitors[index]}
                      />
                      <Button
                        className="bg-dark"
                        index={index}
                        onClick={handleDelete}
                      >
                        -
                      </Button>
                    </Stack>
                  </Form.Group>
                );
              })}
            </Form.Group>

            <Form.Group>
              <Stack gap={1}>
                <Button
                  className="bg-dark"
                  onClick={(e) => (
                    e.preventDefault(), setCompetitors([...competitors, ""])
                  )}
                >
                  Add competitor
                </Button>

                <Button type="submit" className="bg-dark">
                  Submit
                </Button>
              </Stack>
            </Form.Group>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default Homeski;
