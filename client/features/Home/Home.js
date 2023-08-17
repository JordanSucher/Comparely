import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Button, Stack } from "react-bootstrap";


const Home = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log([...competitors, myCompany]);
    await axios.post("/api/comparisons", {
      companies: [...competitors, myCompany],
    }).then((res) => {
      let data = res.data;
      let comparisonId = data["comparisonId"];
      
      navigate(`/compare/${comparisonId}`);
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
  const [myCompany, setMyCompany] = useState("");
  const [competitors, setCompetitors] = useState([""]);
  return (
    <>
      <Container className="text-center p-3 mt-5">
        <h1>Compare.ly</h1>
        <p>Easily keep track of your competitors.</p>
      </Container>

      <Container className="w-50">
        <Form onSubmit={handleSubmit}>
          {/* company URL form */}
          <Form.Group className="mb-5" controlId="companyURL">
            <Row className="text-center justify-content-center">
              <Form.Label className="mb-3">
                What is your company's URL?
              </Form.Label>
              <Form.Control
                type="url"
                name="usersWebsite"
                placeholder="Enter your website"
                className="w-75"
                onChange={(e)=>setMyCompany(e.target.value)}
              />
            </Row>
          </Form.Group>

          {/*  competitor form Group */}
          <Form.Group>
            <Form.Label>Who are your competitor's?</Form.Label>
            {competitors.map((row, index) => {
              return (
                <Form.Group key={index} className="mb-3">
                  <Stack direction="horizontal" gap={2}>
                    <Form.Label
                      htmlFor={"competitorsWebsite" + (index + 1)}
                      className="me-3"
                    >
                      {`${index + 1} `}
                    </Form.Label>
                    <Form.Control
                      type="url"
                      name={"competitorsWebsite" + (index + 1)}
                      index={index}
                      onChange={handleChange}
                      value={competitors[index]}
                      placeholder="Enter Competitors URL"
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

          <Form.Group className="d-flex justify-content-center">
            <Stack gap={2} className="w-50 align-items-center">
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
    </>
  );
};
export default Home;
